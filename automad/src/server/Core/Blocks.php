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
 * Copyright (c) 2020-2023 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

namespace Automad\Core;

use Automad\System\Asset;

defined('AUTOMAD') or die('Direct access not permitted!');

/**
 * The Blocks class.
 *
 * @author Marc Anton Dahmen
 * @copyright Copyright (c) 2020-2023 by Marc Anton Dahmen - https://marcdahmen.de
 * @license MIT license - https://automad.org/license
 */
class Blocks {
	/**
	 * Inject block assets into the header of a page.
	 *
	 * @param string $str
	 * @return string the processed HTML
	 */
	public static function injectAssets(string $str): string {
		$assets = Asset::css('dist/blocks/main.bundle.css', false) .
				  Asset::js('dist/blocks/main.bundle.js', false);

		// Check if there is already any other script tag and try to prepend all assets as first items.
		if (preg_match('/\<(script|link).*\<\/head\>/is', $str)) {
			return preg_replace('/(\<(script|link).*\<\/head\>)/is', $assets . '$1', $str);
		}

		return str_replace('</head>', $assets . '</head>', $str);
	}

	/**
	 * Render blocks created by the EditorJS block editor.
	 *
	 * @param object{blocks: array<int, object{id:string, data:object, type:string, tunes:object}>} $data
	 * @param Automad $Automad
	 * @return string the rendered HTML
	 */
	public static function render(object $data, Automad $Automad): string {
		$flexOpen = false;
		$html = '';

		foreach ($data->blocks as $block) {
			try {
				$blockIsFlexItem = false;
				$width = '';
				$stretched = false;

				if (!empty($block->tunes)) {
					$width = $block->tunes->layout?->width ?? '';
					$stretched = $block->tunes->layout?->stretched ?? false;

					$blockIsFlexItem = ($width && !$stretched);
				}

				if (!$flexOpen && $blockIsFlexItem) {
					$html .= '<am-flex>';
					$flexOpen = true;
				}

				if ($flexOpen && !$blockIsFlexItem) {
					$html .= '</am-flex>';
					$flexOpen = false;
				}

				$blockHtml = call_user_func_array(
					'\\Automad\\Blocks\\' . ucfirst($block->type) . '::render',
					array($block, $Automad)
				);

				// Stretch block.
				if ($stretched) {
					$blockHtml = "<am-stretched>$blockHtml</am-stretched>";
				} elseif ($width) {
					/** @var string */
					$w = str_replace('/', '-', $width);
					$blockHtml = "<am-$w>$blockHtml</am-$w>";
				}

				$html .= $blockHtml;
			} catch (\Exception $e) {
				continue;
			}
		}

		if ($flexOpen) {
			$html .= '</am-flex>';
		}

		return $html;
	}
}
