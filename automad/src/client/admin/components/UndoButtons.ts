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

import {
	Attr,
	create,
	CSS,
	EventName,
	getMetaKeyLabel,
	html,
	listen,
	Undo,
} from '@/core';
import { BaseComponent } from '@/components/Base';

/**
 * Undo/redo buttons component.
 *
 * @extends BaseComponent
 */
class UndoButtonsComponent extends BaseComponent {
	/**
	 * The callback function used when an element is created in the DOM.
	 */
	connectedCallback(): void {
		this.classList.add(CSS.flex);

		this.render();

		this.addListener(
			listen(window, EventName.undoStackUpdate, this.render.bind(this))
		);
	}

	/**
	 * Render the buttons based on the stack sizes.
	 */
	render(): void {
		this.innerHTML = '';

		const meta = getMetaKeyLabel();

		const undoButton = create(
			'span',
			[CSS.navbarItem, CSS.navbarItemGlyph],
			{ [Attr.tooltip]: `${meta} + Z` },
			this,
			'↩'
		);

		const redoButton = create(
			'span',
			[CSS.navbarItem, CSS.navbarItemGlyph],
			{ [Attr.tooltip]: `${meta} + Y` },
			this,
			'↪'
		);

		const { undo, redo } = Undo.size;

		if (undo == 0) {
			undoButton.classList.add(CSS.textMuted);
		}

		if (redo == 0) {
			redoButton.classList.add(CSS.textMuted);
		}

		listen(undoButton, 'click', Undo.undoHandler);
		listen(redoButton, 'click', Undo.redoHandler);
	}
}

customElements.define('am-undo-buttons', UndoButtonsComponent);
