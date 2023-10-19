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
	Attr,
	collectFieldData,
	create,
	createField,
	createGenericModal,
	createSelect,
	CSS,
	debounce,
	FieldTag,
	html,
	query,
	uniqueId,
} from '@/core';
import { ButtonsBlockButtonStyle, ButtonsBlockData } from '@/types';
import { BaseBlock } from './BaseBlock';

export const buttonsAlignOptions = ['start', 'center', 'end'] as const;

/**
 * A buttons block.
 */
export class ButtonsBlock extends BaseBlock<ButtonsBlockData> {
	/**
	 * Sanitizer settings.
	 *
	 * @static
	 */
	static get sanitize() {
		return {
			primaryText: {},
			primaryLink: true,
			secondaryText: {},
			secondaryLink: true,
		};
	}

	/**
	 * Toolbox settings.
	 */
	static get toolbox() {
		return {
			title: App.text('buttonsBlockTitle'),
			icon: '<i class="bi bi-hand-index-thumb"></i>',
		};
	}

	/**
	 * The main layout container.
	 */
	private flex: HTMLElement;

	/**
	 * The button preview containers.
	 */
	private previews: { primary: HTMLElement; secondary: HTMLElement };

	/**
	 * Prepare block data.
	 *
	 * @param data
	 * @param data.primaryText
	 * @param data.primaryLink
	 * @param data.primaryStyle
	 * @param data.primaryOpenInNewTab
	 * @param data.secondaryText
	 * @param data.secondaryLink
	 * @param data.secondaryStyle
	 * @param data.secondaryOpenInNewTab
	 * @param data.align
	 * @param data.gap
	 * @return the slider block data
	 */
	protected prepareData(data: ButtonsBlockData): ButtonsBlockData {
		return {
			primaryText: data.primaryText || 'Button',
			primaryLink: data.primaryLink || '',
			primaryStyle: data.primaryStyle ?? {},
			primaryOpenInNewTab: data.primaryOpenInNewTab ?? true,
			secondaryText: data.secondaryText || '',
			secondaryLink: data.secondaryLink || '',
			secondaryStyle: data.secondaryStyle ?? {},
			secondaryOpenInNewTab: data.secondaryOpenInNewTab ?? true,
			align: data.align ?? 'start',
			gap: data.gap ?? '10rem',
		};
	}

	/**
	 * Render the block.
	 *
	 * @return the rendered element
	 */
	render(): HTMLElement {
		this.wrapper.classList.add(CSS.flex);
		this.wrapper.innerHTML = html`
			<div class="${CSS.editorBlockButtons}">
				<div>
					<span class="__layout-edit ${CSS.editorBlockButtonsEdit}">
						<am-icon-text
							${Attr.icon}="arrow-left-right"
							${Attr.text}="${App.text('buttonsBlockAlignment')}"
						></am-icon-text>
					</span>
				</div>
				<div class="__flex ${CSS.flex}">
					<div
						class="${CSS.flex} ${CSS.flexColumn} ${CSS.flexGap} ${CSS.flexCenter}"
					>
						<div class="__primary"></div>
						<span
							class="__primary-edit ${CSS.editorBlockButtonsEdit}"
						>
							<am-icon-text
								${Attr.icon}="sliders"
								${Attr.text}="${App.text(
									'buttonsBlockSettings'
								)}"
							></am-icon-text>
						</span>
					</div>
					<div
						class="${CSS.flex} ${CSS.flexColumn} ${CSS.flexGap} ${CSS.flexCenter}"
					>
						<div class="__secondary"></div>
						<span
							class="__secondary-edit ${CSS.editorBlockButtonsEdit}"
						>
							<am-icon-text
								${Attr.icon}="sliders"
								${Attr.text}="${App.text(
									'buttonsBlockSettings'
								)}"
							></am-icon-text>
						</span>
					</div>
				</div>
			</div>
		`;

		const buttonLayout = query('.__layout-edit', this.wrapper);
		const buttonPrimary = query('.__primary-edit', this.wrapper);
		const buttonSecondary = query('.__secondary-edit', this.wrapper);

		this.flex = query('.__flex', this.wrapper);
		this.previews = { primary: null, secondary: null };
		this.previews.primary = query('.__primary', this.wrapper);
		this.previews.secondary = query('.__secondary', this.wrapper);

		this.renderButton('primary');
		this.renderButton('secondary');
		this.updateLayout();

		this.api.listeners.on(
			buttonLayout,
			'click',
			this.renderLayoutModal.bind(this)
		);

		this.api.listeners.on(buttonPrimary, 'click', () => {
			this.renderButtonModal('primary');
		});

		this.api.listeners.on(buttonSecondary, 'click', () => {
			this.renderButtonModal('secondary');
		});

		return this.wrapper;
	}

	/**
	 * Update the flex properties.
	 */
	private updateLayout(): void {
		this.wrapper.style.justifyContent = this.data.align;
		this.flex.style.gap = this.data.gap;
	}

	/**
	 * Render a button.
	 *
	 * @param prefix
	 */
	renderButton(prefix: 'primary' | 'secondary'): void {
		const text = this.data[`${prefix}Text`];
		const styleProps: ButtonsBlockButtonStyle = this.data[`${prefix}Style`];
		const style = Object.keys(styleProps).reduce(
			(acc, prop: keyof ButtonsBlockButtonStyle) => {
				if (!styleProps[prop]) {
					return '';
				}

				return `${acc} --${prop}: ${styleProps[prop]};`.trim();
			},
			''
		);

		this.previews[prefix].innerHTML = create(
			'div',
			[CSS.editorBlockButtonsButton],
			{
				style,
				name: `${prefix}Text`,
				contenteditable: 'true',
				placeholder: App.text('buttonsBlockPlaceholder'),
			},
			null,
			html`${text}`
		).outerHTML;
	}

	/**
	 * Render and open the flex layout modal.
	 */
	private renderLayoutModal(): void {
		const { modal, body } = createGenericModal(
			App.text('buttonsBlockAlignment')
		);

		const layout = create('div', [CSS.grid, CSS.gridAuto], {}, body);
		const align = create(
			'div',
			[CSS.field],
			{},
			layout,
			html`
				<div>
					<label class="${CSS.fieldLabel}">
						${App.text('buttonsBlockAlignment')}
					</label>
				</div>
			`
		);

		createSelect(
			[
				{ text: App.text('alignLeft'), value: 'start' },
				{ text: App.text('alignCenter'), value: 'center' },
				{ text: App.text('alignRight'), value: 'end' },
			],
			this.data.align,
			align,
			'align'
		);

		createField(FieldTag.numberUnit, layout, {
			name: 'gap',
			value: this.data.gap,
			key: uniqueId(),
			label: App.text('buttonsBlockGap'),
		});

		setTimeout(() => {
			modal.open();
		}, 0);

		this.api.listeners.on(
			modal,
			'change',
			debounce(() => {
				this.data = {
					...this.data,
					...collectFieldData(body),
				};

				this.updateLayout();
				this.blockAPI.dispatchChange();
			}, 50)
		);
	}

	/**
	 * Render a button settings modal.
	 *
	 * @param prefix
	 */
	private renderButtonModal(button: 'primary' | 'secondary'): void {
		const { modal, body } = createGenericModal(
			App.text('buttonsBlockSettings')
		);

		const link = createField(FieldTag.url, body, {
			name: `${button}Link`,
			key: uniqueId(),
			label: App.text('url'),
			value: this.data[`${button}Link`],
		});

		const target = createField(FieldTag.toggle, body, {
			name: `${button}OpenInNewTab`,
			key: uniqueId(),
			label: App.text('openInNewTab'),
			value: this.data[`${button}OpenInNewTab`],
		});

		const styleContainer = create('div', [], {}, body);

		const style = (
			type: FieldTag,
			name: keyof ButtonsBlockButtonStyle,
			label: string,
			container: HTMLElement = styleContainer,
			hover: boolean = false
		) => {
			createField(type, container, {
				name,
				key: uniqueId(),
				label: `${App.text(label)}${hover ? ' (hover)' : ''}`,
				value: this.data[`${button}Style`][name],
			});
		};

		create('hr', [], {}, styleContainer);

		const colors = create(
			'div',
			[CSS.grid, CSS.gridAuto],
			{},
			styleContainer
		);
		const normal = create('div', [], {}, colors);
		const hover = create('div', [], {}, colors);

		style(FieldTag.color, 'color', 'color', normal);
		style(FieldTag.color, 'background', 'backgroundColor', normal);
		style(FieldTag.color, 'borderColor', 'borderColor', normal);
		style(FieldTag.color, 'hoverColor', 'color', hover, true);
		style(
			FieldTag.color,
			'hoverBackground',
			'backgroundColor',
			hover,
			true
		);
		style(FieldTag.color, 'hoverBorderColor', 'borderColor', hover, true);
		create('hr', [], {}, styleContainer);
		style(FieldTag.numberUnit, 'borderWidth', 'borderWidth');
		style(FieldTag.numberUnit, 'borderRadius', 'borderRadius');
		style(FieldTag.numberUnit, 'paddingVertical', 'paddingVertical');
		style(FieldTag.numberUnit, 'paddingHorizontal', 'paddingHorizontal');

		setTimeout(() => {
			modal.open();
		}, 0);

		this.api.listeners.on(
			modal,
			'change',
			debounce(() => {
				this.data = {
					...this.data,
					[`${button}Style`]: Object.fromEntries(
						Object.entries(collectFieldData(styleContainer)).filter(
							([key, value]) => value.length > 0
						)
					),
					[`${button}Link`]: link.input.value,
					[`${button}OpenInNewTab`]: (
						target.input as HTMLInputElement
					).checked,
				};

				this.renderButton(button);
				this.blockAPI.dispatchChange();
			}, 50)
		);
	}

	/**
	 * Return the section block data.
	 *
	 * @return the saved data
	 */
	save(): ButtonsBlockData {
		return {
			...this.data,
			primaryText: query('[name="primaryText"]', this.flex).innerHTML,
			secondaryText: query('[name="secondaryText"]', this.flex).innerHTML,
		};
	}
}