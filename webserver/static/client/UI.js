function showModalMessage(message) {
	$(".modalContainer").show();
	$(".modal").html(message);
	$(".blackout").show();
}
function hideModal() {
	$(".modalContainer").hide();
	$(".blackout").hide();
}
function showHelp() {
	if ($(".modalContainer").is(":visible")) {
		hideModal();
		return;
	}
	showModalMessage("<li>Controls: Arrows Keys + A</li><li>I'm developing in chrome. So if anything is wonky in other browsers then I'm sorry.</li><li>You might have to hard refresh every so often to get updates.<br>In Windows the shortcut for this is “Ctrl + F5” and on a Mac the shortcut is “Cmd + Shift + R.”. If this doesn't work you may need to clear your cache instead.</li><li>Use TAB to switch between chat and game</li><li>Don't cheat bro</li><br><br>Press H again to dismiss");
}