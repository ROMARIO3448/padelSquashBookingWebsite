<?php
class View
{
	function generate($content_view, $data=null)
	{
		include 'application/views/'.$content_view;
	}
}