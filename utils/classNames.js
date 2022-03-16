//Class to use for className manipulation in React components.
export default function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
