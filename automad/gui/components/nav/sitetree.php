<?php 
/*
 *	                  ....
 *	                .:   '':.
 *	                ::::     ':..
 *	                ::.         ''..
 *	     .:'.. ..':.:::'    . :.   '':.
 *	    :.   ''     ''     '. ::::.. ..:
 *	    ::::.        ..':.. .''':::::  .
 *	    :::::::..    '..::::  :. ::::  :
 *	    ::'':::::::.    ':::.'':.::::  :
 *	    :..   ''::::::....':     ''::  :
 *	    :::::.    ':::::   :     .. '' .
 *	 .''::::::::... ':::.''   ..''  :.''''.
 *	 :..:::'':::::  :::::...:''        :..:
 *	 ::::::. '::::  ::::::::  ..::        .
 *	 ::::::::.::::  ::::::::  :'':.::   .''
 *	 ::: '::::::::.' '':::::  :.' '':  :
 *	 :::   :::::::::..' ::::  ::...'   .
 *	 :::  .::::::::::   ::::  ::::  .:'
 *	  '::'  '':::::::   ::::  : ::  :
 *	            '::::   ::::  :''  .:
 *	             ::::   ::::    ..''
 *	             :::: ..:::: .:''
 *	               ''''  '''''
 *	
 *
 *	AUTOMAD
 *
 *	Copyright (c) 2020-2021 by Marc Anton Dahmen
 *	https://marcdahmen.de
 *
 *	Licensed under the MIT license.
 *	https://automad.org/license
 */


namespace Automad\GUI\Components\Nav;
use Automad\Core\Request;
use Automad\Core\Selection;
use Automad\GUI\Content;
use Automad\GUI\Controllers\Page;

defined('AUTOMAD') or die('Direct access not permitted!');


/**
 *	The site tree component. 
 *
 *	@author Marc Anton Dahmen
 *	@copyright Copyright (c) 2020-2021 by Marc Anton Dahmen - https://marcdahmen.de
 *	@license MIT license - https://automad.org/license
 */

class SiteTree {


	/**
	 *	Create recursive site tree for editing a page. 
	 *	Every page link sends a post request to gui/pages.php containing the page's url.
	 *
	 *	@param object $Automad
	 *	@param string $parent
	 *	@param array $parameters (additional query string parameters to be passed along with the url)
	 *	@param boolean $hideCurrent
	 *	@param string $header
	 *	@return string The branch's HTML
	 */
	
	public static function render($Automad, $parent, $parameters, $hideCurrent = false, $header = false) {
		
		$current = Request::query('url');
		
		$selection = new Selection($Automad->getCollection());
		$selection->filterByParentUrl($parent);
		$selection->sortPages();
		
		$Content = new Content($Automad);
		
		if ($pages = $selection->getSelection(false)) {
			
			$html = '<ul class="uk-nav uk-nav-side">';
			
			if ($header) {
				$html .= '<li class="uk-nav-header">' . $header . '</li>';
			}
			
			foreach ($pages as $key => $Page) {
				
				// Set page icon.  
				$icon = '<i class="uk-icon-file-text-o uk-icon-justify"></i>&nbsp;&nbsp;';

				if ($Page->private) {
					$icon = '<i class="uk-icon-lock uk-icon-justify"></i>&nbsp;&nbsp;';
				}
				
				if ($key != $current || !$hideCurrent) {
				
					// Check if page is currently selected page
					if ($key == $current) {
						$html .= '<li class="uk-active">';
					} else {
						$html .= '<li>';
					}
					
					// Set title in tree.
					$title = htmlspecialchars($Page->get(AM_KEY_TITLE));
					$prefix = Page::extractPrefixFromPath($Page->path);
					
					if (strlen($prefix) > 0) {
						$title = $prefix . ' &ndash; ' . $title;
					}
					
					$html .= '<a title="' . $Page->path . '" href="?' . http_build_query(array_merge($parameters, array('url' => $key)), '', '&amp;') . '">' . 
						 	 $icon . $title . 
						 	 '</a>' .
						 	 self::render($Automad, $key, $parameters, $hideCurrent) .
						 	 '</li>';
					
				}
				
			}
			
			$html .= '</ul>';
		
			return $html;
			
		}
		
	}
	

}