import { animate, group, keyframes, query, state, style, transition, trigger } from "@angular/animations";
import { config } from "rxjs";

export const appear = trigger("appear", [
  state("void", style({ opacity: 0 })),
  state("*", style({ opacity: 1 })),
  transition("void => *", animate(".4s"))
]);

export const rotateBtn = trigger("rotateBtn", [
  state("opened", style({ transform: "rotate(0deg)" })),
  state("closed", style({ transform: "rotate(-180deg)", top: "-2.5px" })),
  transition("opened <=> closed", animate(".3s"))
]);

export const height = trigger("height", [
  state("closed", style({ height: "{{ startHeight }}" }), { params: { startHeight: "*" } }),
  state("opened", style({ height: "{{ endHeight }}" }), { params: { endHeight: "*" } }),
  transition("closed <=> opened", animate(".3s")),
]);

export const appearAlert = trigger("appearAlert", [
  state("*", style({ transform: 'scale(1)' })),
  state("void", style({ transform: 'scale(0)' })),
  transition("* <=> void", animate(".4s"))
]);

export const scale = trigger("scale", [
  state("void", style({ transform: 'scaleY(0)' })),
  state("*", style({ transform: 'scaleY(1)' })),
  transition("void => *", animate(".8s"))
]);

export const newAnimation = trigger("new", [
  transition("void => *", animate("1s", keyframes([
    style({ backgroundColor: '#042391', offset: ".5" }),
    style({ backgroundColor: 'transparent', offset: "1" })
  ])))
]);

export const alertAnimation = trigger("alertAnimation", [
  state("void", style({ transform: "translateY(50%)", opacity: 0 })),
  state("*", style({ opacity: 1 })),
  transition("* <=> void", animate(".2s"))
]);
