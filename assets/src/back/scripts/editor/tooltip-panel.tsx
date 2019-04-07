import { registerPlugin } from "@wordpress/plugins";
import { PluginSidebarMoreMenuItem, PluginSidebar } from "@wordpress/edit-post";
import { PanelBody } from "@wordpress/components";
import { Fragment } from "@wordpress/element";

import { resolveUrl } from "../manifest";
import { __, NAMESPACE } from "../settings";
import { SvgComponent } from "../utils-components";

const pluginName = NAMESPACE + '-tooltip-editor';
const pluginTitle = __( 'Tooltip Editor' );

const iconUrl = resolveUrl('back-icon.svg');


registerPlugin( pluginName, {
	icon: <SvgComponent src={ iconUrl } style={ {width: 20, height: 20} }/>,
	render(){
		return <Fragment>
			<PluginSidebarMoreMenuItem
				target={ pluginName }
			>
				{ pluginTitle }
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				sidebarName={ pluginName }
				title={ pluginTitle }
			>
				<PanelBody>
					iThoughts Tooltip Glossary plugin sidebar
				</PanelBody>
			</PluginSidebar>
		</Fragment>
	},
} );
