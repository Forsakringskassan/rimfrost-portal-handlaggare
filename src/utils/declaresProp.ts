import type { Component } from "vue";

/**
 * Om en (fjärr)komponent deklarerar propen `name`. Används för att bara skicka
 * `authorization` till mikrofrontends som tar emot den: en odeklarerad prop
 * faller igenom som ett HTML-attribut på komponentens rotelement och skulle
 * då synas i DOM:en (PORT-FR-03.6).
 */
export function declaresProp(component: Component, name: string): boolean {
  const props = (component as { props?: unknown }).props;
  if (Array.isArray(props)) {
    return props.includes(name);
  }
  return typeof props === "object" && props !== null && name in props;
}
