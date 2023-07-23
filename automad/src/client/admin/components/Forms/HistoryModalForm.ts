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
	App,
	EventName,
	create,
	CSS,
	html,
	listen,
	query,
	requestAPI,
	getPageURL,
	createSelect,
	Attr,
} from '@/core';
import { SelectComponentOption } from '@/types';
import { BaseComponent } from '@/components/Base';
import { ModalComponent } from '@/components/Modal/Modal';

export class HistoryModalFormComponent extends BaseComponent {
	/**
	 * The modal id.
	 *
	 * @static
	 */
	static MODAL_ID = 'am-history-modal';

	/**
	 * The callback function used when an element is created in the DOM.
	 */
	connectedCallback(): void {
		const modal = create(
			ModalComponent.TAG_NAME,
			[],
			{ id: HistoryModalFormComponent.MODAL_ID },
			this,
			html`
				<am-form
					class="${CSS.modalDialog}"
					${Attr.api}="History/restore"
				>
					<div class="${CSS.modalHeader}">
						<span>${App.text('pageHistory')}</span>
						<am-modal-close
							class="${CSS.modalClose}"
						></am-modal-close>
					</div>
					<div class="${CSS.modalBody}"></div>
					<div class="${CSS.modalFooter}">
						<am-modal-close
							class="${CSS.button} ${CSS.buttonPrimary}"
							>${App.text('cancel')}</am-modal-close
						>
						<am-submit class="${CSS.button} ${CSS.buttonAccent}">
							${App.text('pageHistoryRestore')}
						</am-submit>
					</div>
				</am-form>
			`
		);

		const body = query(`.${CSS.modalBody}`, modal);

		this.addListener(
			listen(modal, EventName.modalOpen, () => {
				this.init(body);
			})
		);
	}

	/**
	 * Init the form.
	 *
	 * @param container
	 * @async
	 */
	private async init(container: HTMLElement): Promise<void> {
		const lang = navigator.language;
		container.innerHTML = '<am-spinner></am-spinner>';

		const { data } = await requestAPI('History/log', {
			url: getPageURL(),
		});

		if (!data) {
			container.innerHTML = App.text('pageHistoryNoRevision');

			return;
		}

		container.innerHTML = '';

		const options = data.reduce(
			(
				res: SelectComponentOption[],
				rev: { time: string; hash: string }
			) => {
				const time = new Date(rev.time);
				const text = time.toLocaleString(lang, {
					dateStyle: 'full',
					timeStyle: 'medium',
				});

				res.push({ text, value: rev.hash });

				return res;
			},
			[]
		);

		createSelect(options, options[0], container, 'revision');
	}
}

customElements.define('am-history-modal-form', HistoryModalFormComponent);