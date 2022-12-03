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

import { App, CSS, html, Routes } from '../../../core';
import { Sections } from '../../Switcher/Switcher';
import { BaseStateIndicatorComponent } from '../BaseStateIndicator';

/**
 * A debug state component.
 *
 * @extends BaseStateIndicatorComponent
 */
class NavbarDebugIndicatorComponent extends BaseStateIndicatorComponent {
	/**
	 * Render the state element.
	 */
	render(): void {
		this.classList.toggle(CSS.displayNone, !App.system.debug);

		if (App.system.debug) {
			this.innerHTML = html`
				<am-link
					class="${CSS.navbarItem}"
					target="${Routes.system}?section=${Sections.debug}"
					am-tooltip="${App.text('debugEnabled')}"
				>
					<i class="bi bi-bug"></i>
				</am-link>
			`;
		} else {
			this.innerHTML = '';
		}
	}
}

customElements.define(
	'am-navbar-debug-indicator',
	NavbarDebugIndicatorComponent
);