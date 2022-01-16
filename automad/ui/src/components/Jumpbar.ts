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
 * Copyright (c) 2021 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

import { AutocompleteComponent } from './Autocomplete';
import { create } from '../utils/create';
import { classes } from '../utils/core';
import { KeyValueMap } from '../utils/types';

/**
 * The Jumpbar field element.
 *
 * @example
 * <am-jumpbar></am-jumpbar>
 *
 * @extends AutocompleteComponent
 */
class JumpbarComponent extends AutocompleteComponent {
	/**
	 * The controller.
	 */
	protected controller = 'UIController::autocompleteJump';

	/**
	 * The initial index.
	 */
	protected initialIndex: null | number = 0;

	/**
	 * The minimum input value length to trigger the dropdown.
	 */
	protected minInputLength = 0;

	/**
	 * Create a dropdown item.
	 *
	 * @param item
	 * @returns the dropdown item element
	 */
	protected createItemElement(item: KeyValueMap): HTMLElement {
		const element = create('a', [classes.dropdownItem], {
			href: item.url,
		});

		element.innerHTML = this.itemHtml(item.icon, item.title, item.subtitle);

		return element;
	}

	/**
	 * Create a value for a dropdown item.
	 *
	 * @param item
	 * @returns the item value
	 */
	protected createItemValue(item: KeyValueMap): string {
		return item.value.toLowerCase();
	}

	/**
	 * Create the inner HTML for a dropdown item.
	 *
	 * @param icon
	 * @param title
	 * @param subtitle
	 * @returns the HTML string
	 */
	private itemHtml(icon: string, title: string, subtitle: string): string {
		return `
			<i class="bi bi-${icon}"></i>
			<span>${title}</span>
			<span class="${classes.muted}">
				${subtitle}
			</span>
		`;
	}

	/**
	 * Update the dropdown and the list of filtered items based on the current input value.
	 */
	protected update(): void {
		const search = this.itemsFiltered[0];

		search.element.setAttribute(
			'href',
			`${search.item.url}&search=${encodeURIComponent(this.input.value)}`
		);

		search.value = `${search.value} ${this.input.value.toLowerCase()}`;
		search.element.innerHTML = this.itemHtml(
			search.item.icon,
			search.item.title,
			this.input.value
		);

		super.update();
	}

	/**
	 * Select an item and use the item value as the input value.
	 *
	 * @param event
	 */
	select(event: Event) {
		if (this.selectedIndex !== null) {
			this.itemsFiltered[this.selectedIndex].element.click();
		}

		this.close();
	}
}

customElements.define('am-jumpbar', JumpbarComponent);