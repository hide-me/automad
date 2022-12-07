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
 * Copyright (c) 2022 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

namespace Automad\Admin\Models;

use Automad\Core\FileSystem;
use Automad\Core\FileUtils;
use Automad\Core\Image;

defined('AUTOMAD') or die('Direct access not permitted!');

/**
 * The image collection model.
 *
 * @author Marc Anton Dahmen
 * @copyright Copyright (c) 2022 by Marc Anton Dahmen - https://marcdahmen.de
 * @license MIT license - https://automad.org/license
 */
class ImageCollectionModel {
	/**
	 * List all images of a page or the shared data directory.
	 *
	 * @param string $path
	 */
	public static function list(string $path) {
		$images = array();
		$globGrep = FileSystem::globGrep(
			$path . '*.*',
			'/\.(' . implode('|', FileUtils::imageFileTypes()) . ')$/i'
		);

		foreach ($globGrep as $file) {
			$image = new Image($file, 500, 500);

			$item = array();
			$item['name'] = basename($file);
			$item['thumbnail'] = AM_BASE_URL . $image->file;

			$images[] = $item;
		}

		return $images;
	}
}
