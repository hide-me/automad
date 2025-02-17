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

import { EditorJSComponent } from '@/components/Editor/EditorJS';
import { listen, query } from '@/core';
import EditorJS, { BlockAPI } from '@editorjs/editorjs';
import { insertBlock } from '../utils';

/**
 * Get the index of a block element.
 *
 * @return the index
 */
const getBlockIndex = (element: HTMLElement): number => {
	return Array.from(element.parentNode.children).indexOf(element);
};

/**
 * Get the closest parent EditorJSComponent element for a given element.
 *
 * @return the containing editor element
 */
const getParentEditorComponent = (element: HTMLElement): EditorJSComponent => {
	return element.closest<EditorJSComponent>(EditorJSComponent.TAG_NAME);
};

/**
 * Set the selection of a block.
 */
const setSelection = (element: HTMLElement): void => {
	if (!element) {
		return;
	}

	const range = document.createRange();
	const selection = window.getSelection();

	range.setStart(element.childNodes[0], 0);
	range.collapse(true);
	selection.removeAllRanges();
	selection.addRange(range);
	element.focus();
};

/**
 * Drag and drop extension for EditorJS.
 * This extensions allows for moving blocks around within an editor
 * instance as well as between different editors.
 */
export class DragDrop {
	/**
	 * The currently dragged block and its index.
	 *
	 * @static
	 */
	private static CURRENT: {
		block: BlockAPI;
		index: number;
	};

	/**
	 * The drop target.
	 *
	 * @static
	 */
	private static TARGET: HTMLElement;

	/**
	 * The component that is associated with plugin instance.
	 */
	private component: EditorJSComponent;

	/**
	 * The EditorJS instance that is associated with plugin instance.
	 */
	private editor: EditorJS;

	/**
	 * The plugin constructor.
	 */
	constructor(component: EditorJSComponent) {
		this.component = component;
		this.editor = component.editor;

		this.initListeners();
	}

	/**
	 * Initialize listeners.
	 */
	private initListeners(): void {
		const handle = query('.ce-toolbar__settings-btn', this.component);

		handle.setAttribute('draggable', 'true');

		listen(handle, 'dragstart', () => {
			const block = this.getCurrentBlock();

			DragDrop.CURRENT = {
				block,
				index: getBlockIndex(block.holder),
			};
		});

		listen(handle, 'drag', () => {
			this.editor.toolbar.close();
		});

		listen(this.component, 'dragover', (event: DragEvent) => {
			event.stopImmediatePropagation();

			const target = event.target as HTMLElement;
			const targetBlock = target.closest<HTMLElement>('.ce-block');

			if (targetBlock) {
				DragDrop.TARGET = targetBlock;
				setSelection(DragDrop.TARGET);

				return;
			}

			const targetEditor = target.closest<EditorJSComponent>(
				EditorJSComponent.TAG_NAME
			);

			if (!targetEditor) {
				return;
			}

			const firstBlock = query<HTMLElement>('.ce-block');

			if (!firstBlock) {
				return;
			}

			DragDrop.TARGET = firstBlock;
			setSelection(DragDrop.TARGET);
		});

		listen(this.component, 'drop', async (event: DragEvent) => {
			event.stopImmediatePropagation();

			await DragDrop.move();
		});
	}

	/**
	 * Get the currently selected (dragged) block.
	 *
	 * @return the current block
	 */
	private getCurrentBlock(): BlockAPI {
		return this.editor.blocks.getBlockByIndex(
			this.editor.blocks.getCurrentBlockIndex()
		);
	}

	/**
	 * Move a block. Either within a single editor or between two different editors.
	 */
	private static async move(): Promise<void> {
		if (DragDrop.CURRENT.block.holder == DragDrop.TARGET) {
			return;
		}

		if (!DragDrop.TARGET || !DragDrop.CURRENT) {
			return;
		}

		const sourceComponent = getParentEditorComponent(
			DragDrop.CURRENT.block.holder
		);

		const sourceIndex = DragDrop.CURRENT.index;

		const targetBlock = DragDrop.TARGET;
		const targetComponent = getParentEditorComponent(targetBlock);
		const targetIndex = getBlockIndex(targetBlock);

		if (sourceComponent === targetComponent) {
			sourceComponent.editor.blocks.move(targetIndex, sourceIndex);
			sourceComponent.editor.caret.setToBlock(targetIndex, 'end');
		} else {
			sourceComponent.editor.blocks.delete(sourceIndex);

			insertBlock(
				DragDrop.CURRENT.block,
				targetComponent.editor,
				targetIndex
			);

			targetComponent.editor.caret.setToBlock(targetIndex, 'end');
		}

		DragDrop.CURRENT = null;
		DragDrop.TARGET = null;
	}
}
