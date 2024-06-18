# Borders

TODO: Write here a description

If using Tailwind/UnoCSS is recommended to use just `ring-{COLOR}`. For example: `ring-neutral-700`
No need to do `ring-neutral-700 ring-1`

## Full Border

<div flex mt-32>
  <div size-64 rounded-2 grid place-content-center border-base>Box</div>
</div>

```html
<div class="border-base ...">Box</div>
```

## One side Border

<div flex justify-center mt-32>
  <div p-8 border-top>Border Top</div>
  <div p-8 border-right>Border Right</div>
  <div p-8 border-bottom>Border Bottom</div>
  <div p-8 border-left>Border Left</div>
</div>

```html
<!-- Using TailwindCSS classes -->

<div class="p-2 border-top">Border Top</div>
<div class="p-2 border-right">Border Right</div>
<div class="p-2 border-bottom">Border Bottom</div>
<div class="p-2 border-left">Border Left</div>
```
