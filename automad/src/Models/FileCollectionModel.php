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
 * Copyright (c) 2021-2022 by Marc Anton Dahmen
 * https://marcdahmen.de
 *
 * Licensed under the MIT license.
 * https://automad.org/license
 */

namespace Automad\Models;

use Automad\Core\Cache;
use Automad\Core\Debug;
use Automad\Core\FileSystem;
use Automad\Core\FileUtils;
use Automad\Core\Image;
use Automad\Core\Str;
use Automad\UI\Utils\Messenger;
use Automad\UI\Utils\Text;

defined('AUTOMAD') or die('Direct access not permitted!');

/**
 * The file collection model.
 *
 * @author Marc Anton Dahmen
 * @copyright Copyright (c) 2021-2022 by Marc Anton Dahmen - https://marcdahmen.de
 * @license MIT license - https://automad.org/license
 */
class FileCollectionModel {
	/**
	 * Delete files.
	 *
	 * @param array $files
	 * @param string $path
	 * @param Messenger $Messenger
	 * @return bool false in case of errors
	 */
	public static function deleteFiles(array $files, string $path, Messenger $Messenger) {
		// Check if directory is writable.
		if (is_writable($path)) {
			$success = array();
			$errors = array();

			foreach ($files as $f) {
				$FileMessenger = new Messenger();

				// Make sure submitted filename has no '../' (basename).
				$file = $path . basename($f);

				if (FileSystem::deleteMedia($file, $FileMessenger)) {
					$success[] = '"' . basename($file) . '"';
				} else {
					$errors[] = $FileMessenger->getError();
				}
			}

			Cache::clear();

			if (!empty($success)) {
				$Messenger->setSuccess(Text::get('deteledSuccess') . '<br />' . implode('<br />', $success));
			}

			$Messenger->setError(implode('<br />', $errors));
		} else {
			$Messenger->setError(Text::get('permissionsDeniedError') . ' "' . basename($path) . '"');
		}

		return !$Messenger->getError();
	}

	/**
	 * List all files of a page or the shared data directory.
	 *
	 * @param string $path
	 */
	public static function list(string $path) {
		$files = array();
		$globGrep = FileSystem::globGrep(
			$path . '*.*',
			'/\.(' . implode('|', FileUtils::allowedFileTypes()) . ')$/i'
		);

		foreach ($globGrep as $file) {
			$item = array();

			if (FileUtils::fileIsImage($file)) {
				$image = new Image($file, 600, 600);

				$item['thumbnail'] = AM_BASE_URL . $image->file;
				$item['width'] = $image->originalWidth;
				$item['height'] = $image->originalHeight;
			}

			$item['mtime'] = date('M j, Y H:i', filemtime($file));
			$item['size'] = FileSystem::getFileSize($file);
			$item['path'] = $file;
			$item['basename'] = basename($file);
			$item['caption'] = FileUtils::caption($file);
			$item['url'] = AM_BASE_URL . $url . '/' . basename($file);
			$item['extension'] = FileSystem::getExtension($file);

			$files[] = $item;
		}

		return $files;
	}

	/**
	 * Upload single file.
	 *
	 * @param object $chunk
	 * @param string $path
	 * @param Messenger $Messenger
	 */
	public static function upload(object $chunk, string $path, Messenger $Messenger) {
		if (empty($chunk->name) || empty($chunk->dzuuid) || empty($chunk->tmp_name)) {
			return false;
		}

		if (!FileSystem::isAllowedFileType($chunk->name)) {
			$Messenger->setError(
				Text::get('unsupportedFileTypeError') . ' "' .
				FileSystem::getExtension($chunk->name) . '"'
			);

			return false;
		}

		if (!is_writable($path)) {
			$Messenger->setError(
				Text::get('permissionsDeniedError') .
				' "' . basename($path) . '"'
			);

			return false;
		}

		$cacheDir = AM_BASE_DIR . AM_DIR_CACHE . '/tmp';
		$cache = $cacheDir . '/' . $chunk->dzuuid . '.chunks';

		FileSystem::makeDir($cacheDir);

		if ($chunk->dzchunkindex === '0' && $chunk->dzchunkbyteoffset === '0') {
			self::clearChunks($cacheDir);
			move_uploaded_file($chunk->tmp_name, $cache);
		} else {
			$bufferSize = intval($chunk->dzchunksize);
			$cacheHandle = fopen($cache, 'a+');
			$tmpHandle = fopen($chunk->tmp_name, 'rb');

			fwrite($cacheHandle, fread($tmpHandle, $bufferSize));

			fclose($tmpHandle);
			fclose($cacheHandle);
			unlink($chunk->tmp_name);
		}

		if (intval($chunk->dztotalchunkcount) - 1 === intval($chunk->dzchunkindex)) {
			$target = $path . Str::slug($chunk->name);

			rename($cache, $target);
			Cache::clear();
		}
	}

	/**
	 * Remove all unfinished uploads that exceeded a given lifetime in seconds.
	 *
	 * @param string $dir
	 * @param int $lifetime
	 */
	private static function clearChunks(string $dir, int $lifetime = 1200) {
		$dir = rtrim($dir, '/');

		if (!$dir) {
			return false;
		}

		$files = FileSystem::glob(rtrim($dir) . '/*.chunks');

		foreach ($files as $file) {
			if (filemtime($file) < time() - $lifetime) {
				unlink($file);
				Debug::log($file);
			}
		}
	}
}
