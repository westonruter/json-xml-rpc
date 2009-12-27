/*
 * JSON/XML-RPC Server Test Console <http://code.google.com/p/json-xml-rpc/>
 * Copyright: 2007, Weston Ruter <http://weston.ruter.net/>
 * License: Dual licensed under MIT <http://creativecommons.org/licenses/MIT/>
 *          and GPL <http://creativecommons.org/licenses/GPL/2.0/> licenses.
 */

//console.info(rpc.__toXMLRPC([2,3,4])); //rpc.parseXMLRPC(rpc.__toXMLRPC([2,3,4]))

window.onerror = function(msg){
	$('responseFieldset').removeClassName('success');
	$('responseFieldset').addClassName('failure');
	
	//NOTE: We should parse response and pretty-print it.... no IFRAME necessary
	//var frameDoc = window.frames.responseIFrame.document;
	//frameDoc.open('text/plain');
	//frameDoc.write("json-in-script error (did you supply the correct callback function name 'myRpcCallback'?): " + msg);
	//frameDoc.close();
	
	displayCode("json-in-script error (did you supply the correct callback function name 'myRpcCallback'?): " + msg, 'text/plain');
	
	new Effect.Highlight('responseFieldset', {startcolor:'#FFCCCC', endcolor:'#FFFFFF', restorecolor:'#FFFFFF'});
	
	return false;
}

function myRpcCallback(result){
	var isFailure = false;
	if(typeof(result) == 'object'){
		if(result.error){
			isFailure = true;
			console.warn(result);
		}
		else console.info(result);
		displayCode(Object.toJSON(result), result, 'application/json');
	}
	else isFailure = true;
	
	//Highlight response area with green or red depending on success or failure
	new Effect.Highlight('responseFieldset', {startcolor:(isFailure ? '#FFCCCC' : '#99FF99'), endcolor:'#FFFFFF', restorecolor:'#FFFFFF'});
}

function submitForm(){
	var input = document.forms[0].elements[0].value;
	var matches;
	//Send request via SCRIPT element and get response as json-in-script with specified callback
	if(/^\/([^\?]+)\?.*JSON-response-callback.+/.test(input)){
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', 'server.php' + input);
		script.setAttribute('class', 'rpcCall');
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(script);
	}
	//Send request via XMLHttpRequest
	else {
		var accept = document.forms[0].accept.options[document.forms[0].accept.selectedIndex].value;
		var xhr = new XMLHttpRequest();
		if(/^\/([^\?]+)(?:\?(.+))?/.test(input)){
			xhr.open("GET", "server.php" + input, false); //GET
			if(accept)
				xhr.setRequestHeader("Accept", accept);
			xhr.send();
		}
		else {
			xhr.open("POST", "server.php", false); // + encodeURI(this.form.elements[0].value)
			xhr.setRequestHeader("Content-Type", (/^\s*<\?xml\b/.test(input) ? "text/xml" : "application/json"));
			if(accept)
				xhr.setRequestHeader("Accept", accept);
			xhr.send(input);
		}
		//NOTE: we should do asynchronous callback
		
		var obj, isFailure = false;
		if(xhr.getResponseHeader('Content-Type').match(/json/)){
			try {
				eval('obj = ' + xhr.responseText);
				if(obj.error){
					isFailure = true;
					console.warn(obj);
				}
				else console.info(obj);
			}
			catch(e){
				isFailure = true;
				console.error("JSON parse error for string: " + xhr.responseText);
			}
		}
		else {
			obj = xhr.responseXML;
			if(!obj || !obj.getElementsByTagName('methodResponse').length){
				console.error("XML parse error for string: " + xhr.responseText);
				isFailure = true;
			}
			else if(obj.getElementsByTagName('fault').length){
				isFailure = true;
				console.warn(obj);
			}
			else console.info(obj);
		}

		displayCode(xhr.responseText, obj, xhr.getResponseHeader('Content-Type'));
		
		//Highlight response area with green or red depending on success or failure
		new Effect.Highlight('responseFieldset', {startcolor:(isFailure ? '#FFCCCC' : '#99FF99'), endcolor:'#FFFFFF', restorecolor:'#FFFFFF'});
	}

	return false;
}

function displayCode(text, object, type){
	if(type == 'text/xml'){
		//var t = "<?xml version\"1.0\"?>\n";
		
	}
	else {
		
	}
	
	
	
	//Pretty print!
	text = text.replace(/&/g, '&amp;');
	text = text.replace(/</g, '&lt;');
	text = text.replace(/>/g, '&gt;');
	$('responseData').innerHTML = text;
}

window.onload = function(){
	$('showUsageTips').onclick = function(){
		//this.parentNode.style.display = 'none';
		if(window.location.hash.match(/usageTips/))
			window.location = "#";
		else
			window.location = "#usageTips";
	}
	
	$('insertXmlRpc').onclick = function(){
		var xml = "<?xml version=\"1.0\"?>\n<methodCall>\n\t<methodName>passThrough</methodName>\n"
		xml += "\t<params>\n";
		xml += "\t\t<param><value><i4>2790</i4></value></param>\n";
		xml += "\t\t<param><value><double>1290320.2323</double></value></param>\n";
		xml += "\t\t<param><value><nil/></value></param>\n";
		xml += "\t\t<param><value><string>Hello world &#x263A;</string></value></param>\n";
		xml += "\t\t<param><value>Hello world2</value></param>\n";
		xml += "\t\t<param><value><dateTime.iso8601>2001-02-03T04:05:06.789</dateTime.iso8601></value></param>\n";
		xml += "\t\t<param><value><struct>\n";
		xml += "\t\t\t<member>\n"
		xml += "\t\t\t\t<name>Color</name>\n";
		xml += "\t\t\t\t<value>Red</value>\n";
		xml += "\t\t\t</member>\n";
		xml += "\t\t\t<member>\n"
		xml += "\t\t\t\t<name>Truth</name>\n";
		xml += "\t\t\t\t<value><boolean>1</boolean></value>\n";
		xml += "\t\t\t</member>\n";
		xml += "\t\t\t<member>\n"
		xml += "\t\t\t\t<name>Encoded</name>\n";
		xml += "\t\t\t\t<value><base64>SSBhbSBzYXlpbmcsIEhlbGxvIHdvcmxk</base64></value>\n";
		xml += "\t\t\t</member>\n";
		xml += "\t\t</struct></value></param>\n";
		xml += "\t</params>\n";
		xml += "\t\t<param><value><array><data>\n";
		xml += "\t\t\t<value><i4>1</i4></value>\n";
		xml += "\t\t\t<value><i4>2</i4></value>\n";
		xml += "\t\t\t<value><i4>3</i4></value>\n";
		xml += "\t\t</data></array></value></param>\n";
		xml += "</methodCall>";
		$('requestCode').value = xml;
	};
	$('insertJsonRpc').onclick = function(){
		var json = "{\n";
		json += "\"version\":\"1.0\",\n"
		json += "\"method\":\"passThrough\",\n"
		json += "\"params\":[\n"
		json += "\t2790,\n";
		json += "\t1290320.2323,\n";
		json += "\tnull,\n";
		json += "\t\"Hello world \\u263A\",\n";
		json += "\t[\n";
		json += "\t\t\"2001-02-03T04:05:06.789\",\n"
		json += "\t\t\"\\/Date(981173106789)\\/\",\n"
		json += "\t\t\"@981173106789@\",\n"
		json += "\t\t{\"__jsonclass__\":[\"Date\", [\"2001-02-03T04:05:06.789\"]]}\n"
		json += "\t],\n";
		json += "\ttrue\n";
		json += "]\n"
		json += "}";
		$('requestCode').value = json;
	};
	$('insertURI').onclick = function(){
		$('requestCode').value = "/passThrough?type=Vacation&city=Seattle&city=Vancouver&city=Portland&passengers=6&&miles=300%2E2&timestamp=981173106789";
	};
	$('insertURICallback').onclick = function(){
		$('requestCode').value = "/passThrough?JSON-response-callback=myRpcCallback&type=Vacation&city=Seattle&city=Vancouver&city=Portland&passengers=6&miles=300%2E2&timestamp=981173106789";
	};
	
	$('tryJSONResultOnly').onclick = function(){
		$('requestCode').value = "/passThrough?JSON-omit-response-wrapper=1&type=Vacation&city=Seattle&city=Vancouver&city=Portland&passengers=6&miles=300%2E2&timestamp=981173106789";
	};
	$('tryJSONResultOnlyWithCallback').onclick = function(){
		$('requestCode').value = "/passThrough?JSON-omit-response-wrapper=1&JSON-response-callback=myRpcCallback&type=Vacation&city=Seattle&city=Vancouver&city=Portland&passengers=6&miles=300%2E2&timestamp=981173106789";
	};
}