$(function(){
var departmentOptions;
var yearOptions;
var subjectOptions;


	$.getJSON('json/department.json',function(result){
		$.each(result, function(i,department) {
			//<option value='countrycode'>contryname</option>
			departmentOptions+="<option value='"
			+department.code+
			"'>"
			+department.name+
			"</option>";
			 });
			 $('#departmentMenu').html(departmentOptions);
	});
	$("#departmentMenu").change(function(){
	if($(this).val()==="FE"){
		
			$.getJSON('json/year.json',function(result){
				yearOptions="";
			$.each(result, function(i,year) {
				//<option value='stateCode'>stateName</option>
				
				yearOptions+="<option value='"
			+year.code+
			"'>"
			+year.name+
			"</option>";
			 });
				 $('#yearMenu').html(yearOptions);
			});
		} else if($(this).val()==="CSE") {

			$.getJSON('json/cseyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="IT") {

			$.getJSON('json/ityear.json',function(result){

				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="E&TC") {

			$.getJSON('json/e&tcyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="AUTO") {

			$.getJSON('json/autoyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="MECH") {

			$.getJSON('json/mechyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  else if($(this).val()==="CIVIL") {

			$.getJSON('json/civilyear.json',function(result){
				yearOptions="";
				$.each(result, function(i,year) {
					//<option value='stateCode'>stateName</option>
					
					yearOptions+="<option value='"
				+year.code+
				"'>"
				+year.name+
				"</option>";
				 });
					 $('#yearMenu').html(yearOptions);
				});
		}  
	});
	
	$("#yearMenu").change(function(){
	if($(this).val()==="FE"){
			$.getJSON('json/feSubjects.json',function(result){
			$.each(result, function(i,subject) {
				//<option value='districtName'>districtName</option>
				subjectOptions+="<option value='"
				+subject.code+
				"'>"
				+subject.name+
				"</option>";
				 });
				 $('#subject').html(subjectOptions);
			});
		}
	});
	
});
