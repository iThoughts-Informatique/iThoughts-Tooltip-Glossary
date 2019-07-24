// @ts-ignore
import tinymceMock, { makeMockEditor } from 'tinymce';

import { APP_NAMESPACE, ns } from '@ithoughts/tooltip-glossary/back/common';
import { makeHtmlElement } from '@ithoughts/tooltip-glossary/common';
import editorConfig from '~editor-config';

jest.mock( '@ithoughts/tooltip-glossary/front' );
import { initTooltip } from '@ithoughts/tooltip-glossary/front';
jest.mock( './buttons' );
import { registerButtons } from './buttons';
jest.mock( './commands' );
import { registerCommands } from './commands';
jest.mock( './utils' );
import { getEditorTip } from './utils';

import { bootstrapTinymcePlugin, plugin, tipsContainer } from './tinymce';

beforeEach( () => {
	jest.clearAllMocks();
} );

it( 'Plugin should be correctly added to the plugin manager', () => {
	expect( tinymceMock.PluginManager.add ).not.toHaveBeenCalled();
	bootstrapTinymcePlugin();
	expect( tinymceMock.PluginManager.add ).toHaveBeenCalledTimes( 1 );
	expect( tinymceMock.PluginManager.add ).toHaveBeenCalledWith( APP_NAMESPACE, plugin );
	expect( ns ).toHaveBeenCalledWith();
} );
describe( 'Plugin initialization', () => {
	it( 'Should add the correct stylesheet', async () => {
		const mockEditor = makeMockEditor();
		await plugin( mockEditor );
		expect( mockEditor.contentCSS ).toEqual( [editorConfig.manifest['back-editor-classic.css']] );
	} );
	it( 'Should register commands', async () => {
		const mockEditor = makeMockEditor();
		await plugin( mockEditor );
		expect( registerCommands ).toHaveBeenCalledTimes( 1 );
		expect( ( registerCommands as jest.Mock ).mock.calls[0][0] ).toBe( mockEditor );
		expect( ( registerCommands as jest.Mock ).mock.calls[0][1] ).toBeInstanceOf( Function );
	} );
	it( 'Should register buttons', async () => {
		const mockEditor = makeMockEditor();
		await plugin( mockEditor );
		expect( registerButtons ).toHaveBeenCalledTimes( 1 );
		expect( registerButtons ).toHaveBeenCalledWith( mockEditor );
	} );
	it( 'Should register an `oninit` function on the editor', async () => {
		const mockEditor = makeMockEditor();
		await plugin( mockEditor );
		expect( mockEditor.on as jest.Mock ).toHaveBeenCalledTimes( 3 );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[0] ).toHaveLength( 2 );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[0][0] ).toBe( 'init' );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[1] ).toHaveLength( 2 );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[1][0] ).toBe( 'BeforeSetcontent' );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[2] ).toHaveLength( 2 );
		expect( ( mockEditor.on as jest.Mock ).mock.calls[2][0] ).toBe( 'GetContent' );
		const initFn = ( mockEditor.on as jest.Mock ).mock.calls[0][1];
		expect( initFn ).toBeInstanceOf( Function );

		expect( tipsContainer ).toBeUndefined();
		expect( makeHtmlElement ).not.toHaveBeenCalled();
		const expectedContainer = document.createElement( 'a' );
		( makeHtmlElement as jest.Mock ).mockReturnValue( expectedContainer );
		jest.spyOn( document.body, 'appendChild' );

		expect( getEditorTip ).not.toHaveBeenCalled();
		const tips = [{}, {}];
		( getEditorTip as jest.Mock ).mockReturnValue( tips );

		expect( initTooltip ).not.toHaveBeenCalled();
		initFn();
		expect( tipsContainer ).toBe( expectedContainer );
		expect( document.body.appendChild ).toHaveBeenCalledWith( expectedContainer );
		expect( getEditorTip ).toHaveBeenCalledTimes( 1 );
		expect( getEditorTip ).toHaveBeenCalledWith( mockEditor );
		expect( initTooltip ).toHaveBeenCalledTimes( 2 );
		expect( initTooltip ).toHaveBeenNthCalledWith( 1, tips[0], expectedContainer, true );
		expect( initTooltip ).toHaveBeenNthCalledWith( 2, tips[1], expectedContainer, true );
	} );
} );
