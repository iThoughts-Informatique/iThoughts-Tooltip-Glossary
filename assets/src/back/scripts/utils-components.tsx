import { HTMLAttributes, SFC } from "@wordpress/element";

import '../styles/utils-components.scss'

interface SvgComponentProps extends HTMLAttributes<SVGSVGElement> {
    src: string;
}
export const SvgComponent: SFC<SvgComponentProps> = (opts: SvgComponentProps) => {
    const { src, className, ...svgTagAttrs } = { className: '', ...opts };
    const classNames = className.split(/\s+/g)
        .map(v => v.trim())
        .filter(v => v)
        .concat(['svg-transparent-wrapper']);
    return <svg
        className={ classNames.join(' ') }
        {...svgTagAttrs}><use xlinkHref={ src }></use></svg>;
}
