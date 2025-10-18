Convert repo.createdAt to a string using .toLocaleString(), .toISOString(), or .toDateString() before rendering.

when do we use asChild attribute:
    When asChild is set to true, the parent component typically does the following:
    It does not render its own default DOM element.
    It clones the single child element passed to it.
    It merges its own props and behavior onto the cloned child element, effectively "passing through" its functionality.
    This results in a cleaner DOM structure and allows for powerful composition patterns, especially in UI libraries where components often need to be highly customizable.