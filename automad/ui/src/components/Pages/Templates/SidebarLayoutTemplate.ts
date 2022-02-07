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
 * Copyright (c) 2022 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 */

import { App, html } from '../../../core';
import { Partials } from '../../../types';

export const sidebarLayout = ({ save, main }: Partials) => {
	return html`
		<div class="am-l-page am-l-page--sidebar">
			<am-toggle
				class="am-l-sidebar__overlay"
				target="body"
				cls="am-l-page--sidebar-open"
			></am-toggle>
			<nav class="am-l-sidebar">
				<am-sidebar class="am-l-sidebar__content">
					<div class="am-l-sidebar__logo"></div>
					<div class="am-l-sidebar__nav">
						<div class="am-l-sidebar__jump">
							<am-jumpbar
								placeholder="jumpbar_placeholder"
							></am-jumpbar>
						</div>
						<nav class="am-c-nav">
							<span class="am-c-nav__label">
								$${App.text('sidebar_header_global')}
							</span>
							<span class="am-c-nav__item">
								<a href="${App.baseURL}" class="am-c-nav__link">
									<i class="bi bi-bookmark"></i>
									$${App.sitename}
								</a>
							</span>
							<am-nav-item
								page="search"
								icon="search"
								text="search_title"
							></am-nav-item>
							<am-nav-item
								page="home"
								icon="window-sidebar"
								text="dashboard_title"
							></am-nav-item>
							<am-nav-item
								page="system"
								icon="sliders"
								text="sys_title"
							></am-nav-item>
							<am-nav-item
								page="shared"
								icon="file-earmark-medical"
								text="shared_title"
							></am-nav-item>
							<am-nav-item
								page="packages"
								icon="box-seam"
								text="packages_title"
							></am-nav-item>
						</nav>
						<am-nav-tree></am-nav-tree>
					</div>
				</am-sidebar>
			</nav>
			<nav class="am-l-navbar am-l-navbar--sidebar">
				<div class="am-l-navbar__logo">Logo</div>
				<div class="am-l-navbar__jump">
					<am-jumpbar placeholder="jumpbar_placeholder"></am-jumpbar>
				</div>
				<div class="am-l-navbar__buttons">
					${save}
					<am-toggle
						target="body"
						cls="am-l-page--sidebar-open"
						class="am-u-display-small"
					>
						Open
					</am-toggle>
				</div>
			</nav>
			<main class="am-l-main am-l-main--sidebar">${main}</main>
			<footer class="am-l-footer">
				<div class="am-l-footer__content">Footer</div>
			</footer>
		</div>
	`;
};