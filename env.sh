#!/bin/sh

# Runtime environment variable injection script
# This script replaces placeholder values in built JavaScript files with actual environment variables at runtime

# Configuration
ASSET_DIR=${ASSET_DIR:-/usr/local/apache2/htdocs}
APP_PREFIX=${APP_PREFIX:-RUNTIME_}

echo "Starting runtime environment variable injection..."
echo "   Asset directory: $ASSET_DIR"
echo "   Prefix: $APP_PREFIX"

# Get all environment variables that start with the specified prefix
env_vars=$(env | grep "^${APP_PREFIX}" || true)

if [ -z "$env_vars" ]; then
    echo "No environment variables found with prefix '$APP_PREFIX'"
    echo "   Skipping injection..."
    exit 0
fi

echo ""
echo "Found environment variables:"
echo "$env_vars" | while IFS= read -r line; do
    echo "   - $line"
done

# Find all .js and .html files in the asset directory
echo ""
echo "Searching for files in: $ASSET_DIR"
files=$(find "$ASSET_DIR" -type f \( -name "*.js" -o -name "*.html" \) 2>/dev/null || true)

if [ -z "$files" ]; then
    echo "No JavaScript or HTML files found in $ASSET_DIR"
    exit 0
fi

file_count=$(echo "$files" | wc -l)
echo "   Found $file_count file(s) to process"

# Replace placeholders with actual values
echo ""
echo "Replacing placeholders with actual values..."

replacement_count=0

echo "$env_vars" | while IFS='=' read -r key value; do
    # Skip if key is empty
    [ -z "$key" ] && continue
    
    # Escape special characters in the value for sed
    escaped_value=$(echo "$value" | sed 's/[\/&]/\\&/g')
    
    echo "   Processing: $key"
    
    # Replace in all found files
    echo "$files" | while IFS= read -r file; do
        # Check if placeholder exists in file before attempting replacement
        if grep -q "$key" "$file" 2>/dev/null; then
            # Perform replacement
            sed -i "s|$key|$escaped_value|g" "$file"
            echo "      ✓ Replaced in: $(basename "$file")"
            replacement_count=$((replacement_count + 1))
        fi
    done
done

echo ""
echo "Environment variable injection complete"
echo ""
