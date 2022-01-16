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

import {
	classes,
	getDashboardURL,
	query,
	queryAll,
	queryParents,
	text,
} from '../utils/core';
import { create } from '../utils/create';
import { requestController } from '../utils/request';
import { KeyValueMap } from '../utils/types';
import { BaseComponent } from './Base';

interface Page {
	url: string;
	title: string;
	path: string;
	parent: string;
	private: boolean;
}

interface NavItem {
	wrapper: HTMLElement;
	link: HTMLElement;
	children: HTMLElement;
}

/**
 * Test whether a view is active.
 *
 * @param view
 * @returns true if the view mathes the URL path
 */
const isActiveView = (view: string): boolean => {
	const regex = new RegExp(`\/${view}\$`, 'i');
	return window.location.pathname.match(regex) != null;
};

/**
 * The navigation tree component.
 *
 * @example
 * <am-nav-tree controller="UIController::navTree"></am-nav-tree>
 *
 * @extends BaseComponent
 */
class NavTreeComponent extends BaseComponent {
	/**
	 * The preloader.
	 */
	private preloader: HTMLElement;

	/**
	 * The controller.
	 */
	protected controller = 'UIController::navTree';

	/**
	 * The callback function used when an element is created in the DOM.
	 */
	connectedCallback(): void {
		this.classList.add(classes.nav);

		create('span', [classes.navLabel], {}, this).innerHTML = text(
			'sidebar_header_pages'
		);

		this.preloader = create('div', [classes.navSpinner], {}, this);
		create('div', [classes.spinner], {}, this.preloader);
		this.init();
	}

	/**
	 * Init the navTree.
	 */
	private async init(): Promise<void> {
		const response = await requestController(this.controller);
		const pages: Page[] = response.data;
		const tree: KeyValueMap = {};
		let parent: HTMLElement;

		pages.sort((a: KeyValueMap, b: KeyValueMap) =>
			a.path > b.path ? 1 : b.path > a.path ? -1 : 0
		);

		this.preloader.remove();

		pages.forEach((page) => {
			if (typeof tree[page.parent] == 'undefined') {
				parent = this;
			} else {
				parent = tree[page.parent].children;
			}

			tree[page.url] = this.createItem(page, parent);
		});

		this.unfoldToActive();
		this.toggleChildrenIcons();
	}

	/**
	 * Create a tree item.
	 *
	 * @param page - the page data object
	 * @param parent - the children container of the parent tree node
	 * @returns the NavItem object
	 */
	private createItem(page: Page, parent: HTMLElement): NavItem {
		const level = (page.path.match(/\/./g) || []).length;
		const wrapper = create(
			'details',
			[classes.navItem],
			{ style: `--level: ${level}` },
			parent
		);
		const link = create('summary', [classes.navLink], {}, wrapper);
		const children = create('div', [classes.navChildren], {}, wrapper);
		const searchParams = new URLSearchParams(window.location.search);

		wrapper.classList.toggle(
			classes.navItemActive,
			page.url == searchParams.get('url') && isActiveView('Page')
		);

		if (!level) {
			wrapper.setAttribute('open', true);
		}

		let icon = 'file-earmark-text';

		if (page.private) {
			icon = 'file-earmark-lock2-fill';
		}

		link.innerHTML = `
			<a href="${getDashboardURL()}/Page?url=${encodeURIComponent(page.url)}">
				<i class="bi bi-${icon}"></i>
				<span>${page.title}</span>
			</a>
		`;

		return { wrapper, link, children };
	}

	/**
	 * Unfold the tree to reveal the active item.
	 */
	private unfoldToActive(): void {
		const activeItem = query(
			`.${classes.navItemActive}`
		) as NavItemComponent;

		if (activeItem) {
			queryParents('details', activeItem).forEach((item: HTMLElement) => {
				item.setAttribute('open', '');
			});
		}
	}

	/**
	 * Toggle visibility of the children arrow indicators depending on the existance of children.
	 */
	private toggleChildrenIcons(): void {
		const childrenContainers = queryAll(`.${classes.navChildren}`, this);

		childrenContainers.forEach((item: Element) => {
			(item.previousSibling as Element).classList.toggle(
				classes.navLinkHasChildren,
				item.childElementCount > 0
			);
		});
	}
}

/**
 * A simple link in the sidebar navigation.
 *
 * @example
 * <am-nav-item view="System" icon="sliders" text="System"></am-nav-item>
 *
 * @extends BaseComponent
 */
class NavItemComponent extends BaseComponent {
	/**
	 * The array of observed attributes.
	 *
	 * @static
	 */
	static get observedAttributes(): string[] {
		return ['view', 'icon', 'text'];
	}

	/**
	 * The callback function used when an element is created in the DOM.
	 */
	connectedCallback(): void {
		this.classList.add(classes.navItem);
		this.classList.toggle(
			classes.navItemActive,
			isActiveView(this.elementAttributes.view)
		);

		this.innerHTML = this.render();
	}

	/**
	 * Render the component.
	 *
	 * @returns the rendered HTML
	 */
	render(): string {
		let link = './';

		if (this.elementAttributes.view) {
			link = `${getDashboardURL()}/${this.elementAttributes.view}`;
		}

		return `
			<a 
			href="${link}" 
			class="${classes.navLink}"
			>
				<i class="bi bi-${this.elementAttributes.icon}"></i>
				<span>${this.elementAttributes.text}</span>
			</a>
		`;
	}
}

customElements.define('am-nav-tree', NavTreeComponent);
customElements.define('am-nav-item', NavItemComponent);