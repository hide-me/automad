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
 * Copyright (c) 2023 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

// @ts-ignore
import NestedList from '@editorjs/nested-list';
import { App } from '@/core';

export class NestedListBlock extends NestedList {
	/**
	 * Get Toolbox settings.
	 *
	 * @returns the settings object
	 */
	static get toolbox() {
		return {
			icon: '<i class="bi bi-list-ul"></i>',
			title: App.text('list'),
		};
	}

	/**
	 * Returns plugin settings
	 *
	 * @returns the settings object
	 */
	renderSettings() {
		const [unordered, ordered] = super.renderSettings();

		return [
			{
				...unordered,
				icon: '<i class="bi bi-list-ul"></i>',
				label: App.text('unorderedList'),
			},
			{
				...ordered,
				icon: '<i class="bi bi-list-ol"></i>',
				label: App.text('orderedList'),
			},
		];
	}
}
