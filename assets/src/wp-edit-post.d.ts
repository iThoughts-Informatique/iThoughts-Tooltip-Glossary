declare module '@wordpress/edit-post'{
	import { ReactNode } from "react";
	export function PluginSidebar(props: {
		children: ReactNode[] | ReactNode;
		className: string;
		icon: JSX.Element;
		isActive?: boolean;
		isPinnable?: boolean;
		isPinned?: boolean;
		pluginName: string;
		sidebarName: string;
		title: string;
		togglePin: any;
		toggleSidebar: any;
	}): JSX.Element;
	export function PluginSidebarMoreMenuItem(props: {
		children: ReactNode[] | ReactNode;
		icon: JSX.Element;
		target: string;
		isSelected: boolean;
		onClick: () => void;
	}): JSX.Element;
}
