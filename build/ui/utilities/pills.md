# Pills

TODO: Write here a description

<div flex mt-32>
  <a href='./' class='pill-blue'>Blue Pill</a>
  <a href='./' class='pill-green'>Green Pill</a>
  <a href='./' class='pill-orange'>Orange Pill</a>
  <a href='./' class='pill-red'>Red Pill</a>
  <a href='./' class='pill-gold'>Gold Pill</a>
</div>

```html
<a href='./' class='pill-blue'>Blue Pill</a>
<a href='./' class='pill-green'>Green Pill</a>
<a href='./' class='pill-orange'>Orange Pill</a>
<a href='./' class='pill-red'>Red Pill</a>
<a href='./' class='pill-gold'>Gold Pill</a>
```

## Small Pills

<div flex mt-32>
  <a href='./' class='pill-blue pill-sm'>Blue Pill</a>
  <a href='./' class='pill-green pill-sm'>Green Pill</a>
  <a href='./' class='pill-orange pill-sm'>Orange Pill</a>
  <a href='./' class='pill-red pill-sm'>Red Pill</a>
  <a href='./' class='pill-gold pill-sm'>Gold Pill</a>
</div>

```html
<a href='./' class='pill-blue pill-sm'>Blue Pill</a>
<a href='./' class='pill-green pill-sm'>Green Pill</a>
<a href='./' class='pill-orange pill-sm'>Orange Pill</a>
<a href='./' class='pill-red pill-sm'>Red Pill</a>
<a href='./' class='pill-gold pill-sm'>Gold Pill</a>
```

## Large Pills
<div flex flex-wrap gap-12 children:text-nowrap class="children:flex-[1_0_30%]">
  <a href='./' class='pill-bold pill-blue'>Large Blue Pill</a>
  <a href='./' class='pill-bold pill-green'>Large Green Pill</a>
  <a href='./' class='pill-bold pill-orange'>Large Orange Pill</a>
  <a href='./' class='pill-bold pill-red'>Large Red Pill</a>
  <a href='./' class='pill-bold pill-gold'>Large Gold Pill</a>
</div>

```html
<a href='./' class='pill-bold pill-blue'>Large Blue Pill</a>
<a href='./' class='pill-bold pill-green'>Large Green Pill</a>
<a href='./' class='pill-bold pill-orange'>Large Orange Pill</a>
<a href='./' class='pill-bold pill-red'>Large Red Pill</a>
<a href='./' class='pill-bold pill-gold'>Large Gold Pill</a>
```

## Variants
<div flex flex-wrap gap-12 items-center mt-32>
  <a href='./' class='pill-secondary'>Secondary Pill</a>
  <a href='./' class='pill-secondary pill-sm'>Secondary Small Pill</a>
  <a href='./' class='col-span-2 max-w-320 pill-secondary pill-bold'>Secondary Large Pill</a>
</div>

```html
<a href='./' class='pill-secondary'>Secondary Pill</a>
<a href='./' class='pill-secondary pill-sm'>Secondary Small Pill</a>
<a href='./' class='pill-secondary pill-bold'>Secondary Large Pill</a>
```

## Combining with other utilities

You can combine pills with other utilities like `arrow`, `loading`, `label`...

<a href='./' class='pill-blue pill-sm arrow' mt-32>Pill with arrow</a>

```html
<a href='./' class='pill-blue pill-sm arrow'>Pill with arrow</a>
```
<div flex mt-32>
  <a href='./' class='pill-secondary loading pill-sm' disabled>Loading</a>
  <a href='./' class='pill-secondary not-loading pill-sm'>Loading</a>
</div>

```html
<a href='./' class='pill-secondary loading pill-sm disabled'>Loading</a>
<a href='./' class='pill-secondary not-loading pill-sm'>Loading</a>
```

<a href='./' class='pill-bold pill-green label' mt-32 max-w-320>Awesome</a>

```html
<a href='./' class='pill-bold pill-green label'>Awesome</a>
```
