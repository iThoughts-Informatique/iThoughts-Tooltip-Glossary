declare module '@wordpress/api'{
    import { Model, Collection } from "backbone";
    
    class PromiseExtended<T> extends Promise<T> {
        then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseExtended<TResult1 | TResult2>;
        done(onDone: (resVal: T) => void): PromiseExtended<T>;
        fail(onFail: (err: any) => void): PromiseExtended<T>;
    }

    export const init: (params: {
        versionString: string;
    }) => PromiseExtended<Model>;
    export const loadPromise: PromiseExtended<any>;
    export const collections: {
        Posts: typeof Collection;
        Glossary: typeof Collection;
    }
    export const models: {
        Post: typeof Model;
        Glossary: typeof Model;
    }


    export interface Guid {
        rendered: string;
    }
    export interface Title {
        rendered: string;
    }
    export interface Content {
        protected: boolean;
        rendered: string;
    }
    export interface Excerpt {
        protected: boolean;
        rendered: string;
    }
    export interface Self {
        href: string;
    }
    export interface Collection {
        href: string;
    }
    export interface About {
        href: string;
    }
    export interface Author {
        embeddable: boolean;
        href: string;
    }
    export interface Reply {
        embeddable: boolean;
        href: string;
    }
    export interface VersionHistory {
        count: number;
        href: string;
    }
    export interface PredecessorVersion {
        href: string;
        id: number;
    }
    export interface WpAttachment {
        href: string;
    }
    export interface WpTerm {
        embeddable: boolean;
        href: string;
        taxonomy: string;
    }
    export interface Cury {
        href: string;
        name: string;
        templated: boolean;
    }
    export interface Links {
        'predecessor-version': PredecessorVersion[];
        'version-history': VersionHistory[];
        'wp:attachment': WpAttachment[];
        'wp:term': WpTerm[];
        about: About[];
        author: Author[];
        collection: Collection[];
        curies: Cury[];
        replies: Reply[];
        self: Self[];
    }
    export interface Post {
        _links: Links;
        author: number;
        categories: number[];
        comment_status: string;
        content: Content;
        date_gmt: Date;
        date: Date;
        excerpt: Excerpt;
        featured_media: number;
        format: string;
        guid: Guid;
        id: number;
        link: string;
        meta: any[];
        modified_gmt: Date;
        modified: Date;
        ping_status: string;
        slug: string;
        status: string;
        sticky: boolean;
        tags: any[];
        template: string;
        title: Title;
        type: string;
    }
}
