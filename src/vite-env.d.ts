/// <reference types="vite/client" />

/**
 * JSX type declarations for BrowserUX custom web components.
 * Required so TypeScript accepts these custom elements in JSX without errors.
 */
declare namespace React {
    namespace JSX {
        interface IntrinsicElements {
            'browserux-theme-switcher': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
            'browserux-share-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                title?: string;
            };
            'browserux-pwa-ui': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                snackbar?: boolean;
                position?: string;
            };
        }
    }
}
