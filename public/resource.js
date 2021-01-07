$(function(){
    var subjectButtons;

         $.getJSON('json/cseSeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSESE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compSe").html(subjectButtons);
        });
        $.getJSON('json/cseTeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSETE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compTe").html(subjectButtons);
        });
        $.getJSON('json/cseBeSubjects.json',function(result){
            subjectButtons=" <input type='hidden' name='year' value='CSEBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#compBe").html(subjectButtons);
        });

        $.getJSON('json/itSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itSe").html(subjectButtons);
        });
        $.getJSON('json/itTeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itTe").html(subjectButtons);
        });
       
        $.getJSON('json/itBeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='ITBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#itBe").html(subjectButtons);
        });
       
        $.getJSON('json/e&tcSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='E&TCSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#etcSe").html(subjectButtons);
        });

        $.getJSON('json/e&tcTeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='E&TCTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#etcTe").html(subjectButtons);
        });

        $.getJSON('json/e&tcBeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='E&TCBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#etcBe").html(subjectButtons);
        });

        $.getJSON('json/feSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='FE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#fe").html(subjectButtons);
        });

        $.getJSON('json/autoSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='AUTOSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#autoSe").html(subjectButtons);
        });

        $.getJSON('json/autoTeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='AUTOTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#autoTe").html(subjectButtons);
        });

        $.getJSON('json/autoBeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='AUTOBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#autoBe").html(subjectButtons);
        });

        $.getJSON('json/mechSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='MECHSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#mechSe").html(subjectButtons);
        });

        $.getJSON('json/mechTeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='MECHTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#mechTe").html(subjectButtons);
        });

        $.getJSON('json/mechBeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='MECHBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#mechBe").html(subjectButtons);
        });

        $.getJSON('json/civilSeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='CIVILSE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#civilSe").html(subjectButtons);
        });

        $.getJSON('json/civilTeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='CIVILTE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#civilTe").html(subjectButtons);
        });

        $.getJSON('json/civilBeSubjects.json',function(result){
            subjectButtons="<input type='hidden' name='year' value='CIVILBE'>";
            $.each(result, function(i,subject) {
                subjectButtons+="<button type='submit' class='dropdown-item' name='subject' value="
                +subject.code+
                ">"
                +subject.name+
                "</button>";
                 });
                 console.log(subjectButtons);
                 $("#civilBe").html(subjectButtons);
        });

       
       
       
    
        
    });
