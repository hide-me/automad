<?php
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
 * Copyright (c) 2014-2022 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

namespace Automad\Admin\UI;

use Automad\System\Asset;

defined('AUTOMAD') or die('Direct access not permitted!');

/**
 * The base for all dashboard views.
 *
 * @author Marc Anton Dahmen
 * @copyright Copyright (c) 2014-2022 by Marc Anton Dahmen - https://marcdahmen.de
 * @license MIT license - https://automad.org/license
 */
class Dashboard {
	public static function render() {
		$fn = function ($expression) {
			return $expression;
		};

		return <<< HTML
			<!DOCTYPE html>
			<html lang="en" class="am-ui">
			<head>
				<meta charset="utf-8">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="robots" content="noindex">
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
				>
				<title>Automad</title>
				{$fn(Asset::icon('ui/dist/favicon.ico'))}
				{$fn(Asset::css('ui/dist/vendor.bundle.css'))}
				{$fn(Asset::css('ui/dist/ui.bundle.css'))}
				{$fn(Asset::js('ui/dist/vendor.bundle.js'))}
				{$fn(Asset::js('ui/dist/ui.bundle.js'))}
			</head>
			<body>
				<am-root base="{$fn(AM_BASE_INDEX)}"></am-root>
			</body>
			</html>
			HTML;
	}
}