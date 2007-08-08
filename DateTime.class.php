<?php
# DateTime Class for PHP4
# Version: 0.1 (2007-07-29)
# Copyright: 2007, Weston Ruter <http://weston.ruter.net/>
# License: GNU General Public License, Free Software Foundation
#          <http://creativecommons.org/licenses/GPL/2.0/>

class DateTime {
	var $timestamp = 0;
	function DateTime($param){
		$this->timestamp = strtotime($param);
	}
	function format($str){
		return gmdate($str, $this->timestamp);
	}
}

?>