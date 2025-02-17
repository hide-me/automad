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
 * Copyright (c) 2021-2023 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

import {
	App,
	create,
	createEditor,
	CSS,
	debounce,
	FieldTag,
	fire,
	FormDataProviders,
	listen,
	listenToClassChange,
	query,
	queryAll,
} from '@/core';
import { BaseFieldComponent } from './BaseField';
import { EditorOutputData, UndoValue } from '@/types';
import { LayoutTune } from '@/editor/tunes/Layout';
import { EditorJSComponent } from '@/components/Editor/EditorJS';
import { EditorPortalDestinationComponent } from '@/components/Editor/EditorPortal';

/**
 * A block editor field.
 *
 * @extends BaseFieldComponent
 */
export class EditorComponent extends BaseFieldComponent {
	/**
	 * The editor component.
	 */
	private editorJS: EditorJSComponent;

	/**
	 * Don't link the label.
	 */
	protected linkLabel = false;

	/**
	 * The editor value that serves a input value for the parent form.
	 */
	value: EditorOutputData;

	/**
	 * Render the field.
	 */
	createInput(): void {
		const { name, id, value } = this._data;

		this.setAttribute('name', name);
		this.value = value as EditorOutputData;

		this.editorJS = createEditor(
			create('div', [], { id }, this),
			{ blocks: this.value.blocks },
			{
				onChange: async (api) => {
					const { blocks } =
						(await api.saver.save()) as EditorOutputData;

					if (
						JSON.stringify(this.value.blocks) ===
						JSON.stringify(blocks)
					) {
						return;
					}

					this.value = {
						blocks: [...blocks],
						automadVersion: App.version,
					};

					fire('input', this);
				},
			},
			false
		);

		this.attachToolbarPositionObserver();
	}

	/**
	 * Return the field that is observed for changes.
	 *
	 * @return the input field
	 */
	getValueProvider(): HTMLElement {
		return this;
	}

	/**
	 * A function that can be used to mutate the field value.
	 *
	 * @param value
	 */
	async mutate(value: UndoValue): Promise<void> {
		queryAll(EditorPortalDestinationComponent.TAG_NAME, this).forEach(
			(dest: EditorPortalDestinationComponent) => {
				dest.remove();
			}
		);

		this.value = value;

		if (value.blocks.length > 0) {
			await this.editorJS.editor.render(value);
		} else {
			this.editorJS.editor.clear();
		}

		this.editorJS.onRender();
	}

	/**
	 * Query the current field value.
	 *
	 * @return the current value
	 */
	query() {
		return this.value;
	}

	/**
	 * Attach observer and listeners in order to update the toolbar positions within sections.
	 * Note that this should be done here in the parent component in order to be able to properly detach and destroy
	 * listeners and observers after changing views.
	 */
	private attachToolbarPositionObserver(): void {
		this.addListener(
			listenToClassChange(this, (mutation) => {
				const target = mutation.target as HTMLElement;

				if (!target.classList.contains('ce-block--focused')) {
					return;
				}

				LayoutTune.updateToolbarPosition(target);
			})
		);

		this.addListener(
			listen(
				this,
				'mouseover',
				debounce((event: Event) => {
					event.stopPropagation();

					const target = event.target as HTMLElement;
					const block = target.closest<HTMLElement>('.ce-block');

					LayoutTune.updateToolbarPosition(block);
				}, 10),
				'.ce-block'
			)
		);

		// Expand height of editor when toolbar is open.
		this.addListener(
			listenToClassChange(this, (mutation) => {
				const target = mutation.target as HTMLElement;

				if (!target.classList.contains('codex-editor')) {
					return;
				}

				if (
					!target.classList.contains('codex-editor--toolbox-opened')
				) {
					this.style.removeProperty('min-height');

					return;
				}

				const popover = query('.ce-popover', target);

				setTimeout(() => {
					const popoverRect = popover.getBoundingClientRect();
					const editorRect = this.getBoundingClientRect();
					const minHeight =
						popoverRect.top - editorRect.top + popoverRect.height;
					this.style.minHeight = `${minHeight}px`;
				}, 0);
			})
		);

		// Expand height of editor when tunes popover is open.
		this.addListener(
			listenToClassChange(this, (mutation) => {
				const target = mutation.target as HTMLElement;

				if (!target.classList.contains('ce-popover')) {
					return;
				}

				if (!target.closest('.ce-settings')) {
					return;
				}

				if (!target.classList.contains('ce-popover--opened')) {
					this.style.removeProperty('min-height');

					return;
				}

				setTimeout(() => {
					const popoverRect = target.getBoundingClientRect();
					const editorRect = this.getBoundingClientRect();
					const minHeight =
						popoverRect.top - editorRect.top + popoverRect.height;
					this.style.minHeight = `${minHeight}px`;
				}, 0);
			})
		);
	}
}

FormDataProviders.add(FieldTag.editor);
customElements.define(FieldTag.editor, EditorComponent);
