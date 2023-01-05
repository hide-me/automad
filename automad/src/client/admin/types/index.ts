/*
 *                    ....
 *                  .:   '':.
 *                  ::::     ':..
 *                  ::.         ''..
 *       .:'.. ..':.:::'    . :.   '':.
 *      :.   ''     ''     '. ::::.. ..:
 *      ::::.        ..':.. .''':::::  .
 *      :::::::..    '..::::  :. ::::  :
 *      ::'':::::::.    ':::.'':.::::  :
 *      :..   ''::::::....':     ''::  :
 *      :::::.    ':::::   :     .. '' .
 *   .''::::::::... ':::.''   ..''  :.''''.
 *   :..:::'':::::  :::::...:''        :..:
 *   ::::::. '::::  ::::::::  ..::        .
 *   ::::::::.::::  ::::::::  :'':.::   .''
 *   ::: '::::::::.' '':::::  :.' '':  :
 *   :::   :::::::::..' ::::  ::...'   .
 *   :::  .::::::::::   ::::  ::::  .:'
 *    '::'  '':::::::   ::::  : ::  :
 *              '::::   ::::  :''  .:
 *               ::::   ::::    ..''
 *               :::: ..:::: .:''
 *                 ''''  '''''
 *
 *
 * AUTOMAD
 *
 * Copyright (c) 2021-2022 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

export * from './form';
export * from './packages';
export * from './page';
export * from './search';
export * from './switcher';
export * from './system';
import { PageMetaData } from '.';
import { InputElement } from './form';

export interface KeyValueMap {
	[key: string | number]: any;
}

export interface AutocompleteItem {
	element: HTMLElement;
	value: string;
	item: KeyValueMap;
}

export interface AutocompleteItemData {
	value: string;
	title: string;
}

export interface BindingOptions {
	input?: InputElement;
	modifier?: Function;
	initial?: any;
}

export interface Image {
	name: string;
	thumbnail: string;
}

export interface JumpbarItemData {
	value: string;
	title: string;
	icon: string;
	subtitle?: string;
	target?: string;
	external?: string;
	cls?: string[];
}

export interface File {
	basename: string;
	extension: string;
	mtime: string;
	size: string;
	path: string;
	url: string;
	caption: string;
	thumbnail?: string;
	width?: number;
	height?: number;
}

export interface Listener {
	remove: Function;
}

export interface NavTreeItem {
	wrapper: HTMLElement;
	summary: HTMLElement;
	children: HTMLElement;
	page: PageMetaData;
}

export interface Partials {
	[key: string]: string;
}

export interface Theme {
	author: string;
	description: string;
	license: string;
	name: string;
	path: string;
	readme: string;
	templates: string[];
	tooltips: KeyValueMap;
	version?: string;
}

export interface ThemeCollection {
	[key: string]: Theme;
}
