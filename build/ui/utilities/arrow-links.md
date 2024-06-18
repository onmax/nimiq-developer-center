# Arrow Links

TODO: Write here a description

<div flex mt-32>
  <a href='./' class='arrow-back'>Arrow back</a>
  <a href='https://nimiq.com/' target="_blank" rel="noopener" class='arrow'>External link</a>
  <a href='../design/logo' class='arrow'>Internal link</a>
</div>

```html
<a href='./' class='arrow-back'>Arrow back</a>
<a href='https://nimiq.com/' class='arrow'>External link</a>
<a href='/design/logo' class='arrow'>Internal link</a>
```
<br>
You can even nest the arrow in a `tag` element

<div flex justify-center mt-32>
  <a href='https://nimiq.com/' target="_blank" rel="noopener" class='flex flex-col gap-12 px-24 py-16 raw bg-neutral-200 rounded-8 max-w-320'>
    <h3 class='flex items-center arrow after:ml-auto'>External link</h3>
    <p class='text-12 text-neutral-800 text-pretty'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </a>
</div>

```html
<!-- Using TailwindCSS classes -->

<a href='https://nimiq.com/' class='flex flex-col gap-3 px-6 py-4 raw bg-neutral-200 rounded-2'>
  <h3 class='flex items-center arrow after:ml-auto'>
    External link
  </h3>
  <p class='text-3 text-neutral-800 text-pretty'>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>
</a>
```
