
async function fillForm() {
	var form = document.forms['cc1'];
    form['name'].value = 'Superman';
    form['CCNo'].value = '4000-4444-4444-4444';
    form['CCExpiresMonth'].value = '01';
    form['CCExpiresYear'].value = '2021';
	//document.getElementById("form").submit();
	form.submit();
}


var form = document.getElementById("cc1");
form.onclick = fillForm;
