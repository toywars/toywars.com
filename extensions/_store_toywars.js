/* **************************************************************

   Copyright 2011 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

/*
An extension for acquiring and displaying 'lists' of categories.
The functions here are designed to work with 'reasonable' size lists of categories.
*/


var store_toywars = function() {
	var r = {

	vars : {
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls


					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
				app.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
						//make a call to get a search
						var $context = $(app.u.jqSelector('#',P.parentID));
						var _tag = {"callback" : "productElasticSearchList", "extension":"store_toywars", "$context" : $context, "datapointer":"ProdPageElastic"};
						
						
						/*if(app.model.fetchData(_tag.datapointer)){
							app.u.handleCallback(_tag);
							}
						else {*/
							var obj = {'filter':{'term':{'tags':'IS_BESTSELLER'}}};
							obj = app.ext.store_search.u.buildElasticRaw(obj);
							obj.size = 12;
							app.ext.store_search.calls.appPublicSearch.init(obj, _tag);
							//}
						//callback will call anycontent and append to product
						}]);
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
				}
			},

			startExtension : {
				onSuccess : function() {
				},
				onError : function (){
				}
			},
			
			productElasticSearchList : {
				onSuccess : function(responseData){
					//alert("hello");
					//app.u.dump(responseData, "debug");
					
					$('.elasticlist', responseData.$context).anycontent({"templateID":"prodPageElasticTemplate","datapointer":"ProdPageElastic"});
					//alert($('.elasticlist', responseData.$context).html());
					},
				onError : function(){
					}
				}
		}, //callbacks

////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {

			
		}, //actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {
			
			yyyymmdd2Pretty : function($tag, str) {
				var r = false;
				if(Number(str)) {
				 var year = str.substr(0,4)
				 var month = Number(str.substr(4,2));
				 var day = str.substr(6,2);
				 var d = new Date();
				 d.setFullYear(year, (month - 1), day)
			//     app.u.dump(" date obj: "); app.u.dump(d);
			//     app.u.dump(" -> YYYYMMDD2Pretty ["+str+"]: Y["+year+"]  Y["+month+"]  Y["+day+"] ");
				  r = month+"/"+day+"/"+year;
				 }
				else {
				 app.u.dump("WARNING! the parameter passed into YYYYMMDD2Pretty is not a numder ["+str+"]");
				 
				 var convertToNum = '';
				 convertToNum = str.value;
				 //app.u.dump(str.value);
				 if(Number(convertToNum)){
					 var year = convertToNum.substr(0,4)
					 var month = Number(convertToNum.substr(4,2));
					 var day = convertToNum.substr(6,2);
					 var d = new Date();
					 d.setFullYear(year, (month - 1), day)
				//     app.u.dump(" date obj: "); app.u.dump(d);
				//     app.u.dump(" -> YYYYMMDD2Pretty ["+str+"]: Y["+year+"]  Y["+month+"]  Y["+day+"] ");
				//app.u.dump(d);
					 r = month+"/"+day+"/"+year;
					 app.u.dump(r);
				 }
				 else{
					 app.u.dump("WARNING! the parameter passed into YYYYMMDD2Pretty cannot be converted into a string. ["+str+"]");
				 }
			
				 }
				$tag.html(r);
			}, //yyyymmdd2Pretty
			
			showIfSetPreorder : function($tag,data)	{
			app.u.dump("showIfSet: "+data.value);
			if (data.value.toLowerCase().indexOf("is:preorder") >= 0)	{
				$tag.show().css('display','block'); //IE isn't responding to the 'show', so the display:block is added as well.
				}
			},
			
		hideIfSetPreorder : function($tag,data)	{
			app.u.dump("showIfSet: "+data.value);
			if (data.value.toLowerCase().indexOf("is:preorder") >= 0)	{
				$tag.hide(); //IE isn't responding to the 'show', so the display:block is added as well.
				}
			}

			
				
			}, //renderFormats
			
			
			
////////////////////////////////////   VARATIONS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
			variations : {

			renderOptionCUSTOMIMGSELECT: function(pog) {

//				app.u.dump('POG -> '); app.u.dump(pog);

				var $parent = $('<div class="optionsParent" />');
				var $select = $("<select class='optionsSelect' name="+pog.id+" />");
				var $hint = $('<div class="zhint">mouse over thumbnail to see larger swatches</div>');
				$parent.append($hint);

				var len = pog.options.length;				
				if(len > 0) {
					optionTxt = (pog['optional'] == 1) ? "" : "Please choose (required)";
					selOption = "<option value='' disabled='disabled' selected='selected'>"+optionTxt+"<\/option>";
					$select.append(selOption);
				}

				var $option;
				for (var index in pog.options) {
					var option = pog.options[index];
//					app.u.dump('IMG: '); app.u.dump(option.img);
					$option = $("<option value="+option.v+">"+option.prompt+"</option>");
					$select.append($option);
					var thumbImg = app.u.makeImage({"w":pog.width,"h":pog.height,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});
					var bigImg = app.u.makeImage({"w":200,"h":200,"name":option.img,"b":"FFFFFF","tag":false,"lib":app.username});																									//need to try moving these to be appended

					var $imgContainer = $('<div class="floatLeft optionImagesCont" data-pogval="'+option.v+'" />');
					/*var $mzpLink = $('<a id="imgGridHref_'+pog.id+'_'+option.v+'" alt="'+option.prompt+'" class="MagicZoom" title="'+option.prompt+'" rel="hint:false; show-title:top; title-source=#id;" href="'+mzBigImg+'" />');
					
					$mzpLink.click(function(){
						var pogval = $(this).parent().attr('data-pogval');
						
						$select.val(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						app.u.dump(pogval);
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								}
							});	
						});
						
					$mzpLink.append($('<img src='+thumbImg+' title="'+pog.prompt+'" data-pogval="'+option.v+'"/>'));
					$imgContainer.append($mzpLink);*/

					$imgContainer.click(function(){
						var pogval = $(this).attr('data-pogval');

						$select.val(pogval);
						$('.optionImagesCont', $parent).each(function(){
							if($(this).hasClass('selected')){ 
								$(this).removeClass('selected'); 
								}
							if($(this).attr('data-pogval') == pogval){ 
								$(this).addClass('selected'); 
								}
							});	
						});

					$img = $('<img src="'+thumbImg+'" data-big-img="'+bigImg+'" data-tooltip-title="'+option.prompt+'"/>')

					//Tooltip called in init

					$imgContainer.append($img);
					$parent.append($imgContainer);

	//				to add description info to label for
	//				$mzpLink.mouseover(function() {
	//					$('.optionImagesCont', $parent).each(function(){
	//						$('label[value="Fabric"]').empty().text('Fabric: '+option.prompt+'');
	//						app.u.dump(option.prompt);
	//					});		
	//				});

				} // END for

				$parent.append($select);
				return $parent;
			}, // END renderOptionCUSTOMIMGSELECT

			xinit : function(){
				this.addHandler("type","imgselect","renderOptionCUSTOMIMGSELECT");
				app.u.dump("--- RUNNING XINIT");
			}

		},

////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
			
			createBuyer : function($form){
				var obj = $form.serializeJSON();
				app.u.dump(obj);
			},
			
			getDOWFromDay : function(X)	{
//				app.u.dump("BEGIN beachmart.u.getDOWFromDay ["+X+"]");
				var weekdays = new Array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
				return weekdays[X];
			}
				
			}, //u



//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}