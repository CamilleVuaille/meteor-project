// Global access
tasks = new Mongo.Collection( "tasks" );

if ( Meteor.isServer )
{
	Meteor.startup
	(
		function ()
		{
			// Si pas de donnée, insert une premiere donnée
			if( ! tasks.find().count() )
			{
				tasks.insert( { text : "première tache", status : false} );
			}
		}
	);
}

if ( Meteor.isClient )
{
	Template.newtask.events({	

		// insert une nouvelle tache
	  	"click #submit" : function (event, template){
	  		event.preventDefault();
	  		var text_task = template.find('#task').value;
	  		tasks.insert({ text : text_task,  status : false});
		}
	});
	Template.tasks.events({	

		// Supprime une tâche sélectionnée 
	  	"click .delete" : function(){
			tasks.remove(this._id);
		},
	
		// Transforme le span en input pour pouvoir update la tpache
		"click .update" : function(event, template){
			var span = $(event.target).prev().find(".span");
			var spanText = span.text();
			span.replaceWith("<input type='text' name='update-text-task' class='update-text-task' value='" + spanText + "'>");

			var div_update = $(event.target).prev().find('.div-update');
			div_update.css("display", "inline");
		},

		// envoie la valeur modifiée en bdd
		"click .update-submit" : function (event, template){
			event.preventDefault();
	  		var update_text_task = $(event.target).parent().prev('.update-text-task');
	  		var value = update_text_task.val();
	  		tasks.update(this._id, { 
	  			$set: {text : value,  status : false},
	  		});
	  		update_text_task.replaceWith("<span class='span'>" + value + "</span>");

	  		var div_update = $(event.target).parent();
			div_update.css("display", "none");

		},

		// annule la modification du champ
		"click .cancel" : function (event, template){
			event.preventDefault();
	  		var update_text_task = $(event.target).parent().prev('.update-text-task');
	  		var value = update_text_task.val();
	  		
	  		update_text_task.replaceWith("<span class='span'>" + update_text_task.attr('value')+ "</span>");

	  		var div_update = $(event.target).parent();
			div_update.css("display", "none");

		},
	
		// Si la checkbox est checkée, elle se uncheck et inversement. Change également le statut en bdd
		"click input[type=checkbox]" : function(){
			console.log('arrr');
			tasks.update(this._id, {
		    	$set: { status: ! this.status },
		    });
		}

	});

	// retourne toutes les tâches
	Template.tasks.helpers
	( {
		all_tasks : function ()
		{
			return tasks.find();
		}
	} );

}




/*Template.newtask.events({
	  	'.new-task'(event) {
		    event.preventDefault();
			form = event.target;
			text = form.text.value;

		    Tasks.insert({text,  status : "uncheck"});

		    form.text.value = '';
		},
	});
*/