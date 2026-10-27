import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { canNavigateInApp, navigateInApp } from './navigation';

export default function AppLink({ href, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const follow = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!href || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (props.download !== undefined || props.target && props.target !== '_self') return;
    if (!canNavigateInApp(location.href, href)) return;
    event.preventDefault();
    if (new URL(href, location.href).href === location.href) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    navigateInApp(href);
  };
  return <a {...props} href={href} onClick={follow}/>;
}
