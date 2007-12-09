# Convert RPCServer.class.php from PHP5 into PHP4
# Weston Ruter <http://weston.ruter.net/>
# July 2007

open PHP, "RPCServer.class.php";
$source = join '', <PHP>;
close PHP;

open PHP, ">RPCServer.class.php4";

#Change the PHP version info
$source =~ s{(?<=JSON/XML-RPC Server in )PHP5}{PHP4};
$source =~ s{# //\$server->.+?\n}{# \$server->processRequest();\n};
$source =~ s{'RPCServer\.class\.php'}{'RPCServer.class.php4'}g;
$source =~ s{date_default_timezone_set\("UTC"\)}{putenv('TZ=UTC')};

#Remove "self"
$source =~ s{self(?=::)}{RPCServer}g;

#Replace constants
#%consts = ();
@constPairs = ($source =~ m{const\s+(\w+)\s*=\s*(.+?);}g);
for($i = 0; $i < @constPairs; $i+=2){
	$constName = $constPairs[$i];
	$constValue = $constPairs[$i+1];
	
	$source =~ s{const\s+$constName}{var \$$constName}g;
	#$source =~ s{::$constName\b}{::\$$constName}g;
	$source =~ s{(RPCServer|self)::$constName\b}{\$this->$constName}g;
	#$consts{$constName} = $constValue;
}

#Remove member visibility keywords for functions
$source =~ s{((?:public|private|protected|static)\s*)+(?=function)}{}g;

#Remove member visibility keywords for members
$source =~ s{((?:public|private|protected|static)\s*)+(?=\s\$(?!instance))}{var}g;

#Make callbacks to static PHP5 functions
$source =~ s{array\('RPCServer', }{array(&\$this, }g;
$source =~ s{RPCServer::\$charToJSON}{\$this->charToJSON}g;

#Remove PHP5 code
#$source =~ s{(\t| )/\*BEGIN PHP5\*/.+?/\*END PHP5\*/}{}gs;
$source =~ s{/\*BEGIN PHP5\*/}{/\*BEGIN PHP5\*\*}g;
$source =~ s{/\*END PHP5\*/}{\*\*END PHP5\*/}g;

$source =~ s{/\*BEGIN PHP4\*\*}{/\*BEGIN PHP4\*/}g;
$source =~ s{\*\*END PHP4\*/}{/\*END PHP4\*/}g;

#Allow for DOM XML Functions
$source =~ s{->documentElement}{->document_element()}g;
$source =~ s{->getElementsByTagName\b}{->get_elements_by_tagname}g;
$source =~ s{->item\(([^\)]+)\)}{[$1]}g;
$source =~ s{->firstChild}{->first_child}g;
$source =~ s{->nodeValue}{->node_value}g;
$source =~ s{->nextSibling}{->next_sibling}g;
$source =~ s{->nodeType}{->node_type}g;
$source =~ s{->nodeName}{->node_name}g;
$source =~ s{->childNodes}{->child_nodes}g;
$source =~ s{((?:\$?\w+)(?:->\$?\w+)*)->length}{count($1)}g;

print PHP $source;
close PHP;
