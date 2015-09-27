var bio = {
  name: "Joshua Bence",
  role: "Senior Software Engineer",
  contacts: {
    mobile: "719-201-1577",
    email: "joshua.bence@gmail.com",
    github: "jdbence",
    twitter: "n/a",
    location: "Mountain View, CA"
  },
  welcomeMessage: "Lets Rock!!",
  skills: ["Unity","NodeJS","HTML5","CSS3","Gulp"],
  biopic: "https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/8/000/243/3f3/1af90c4.jpg",
  display: function(){
    
    var role = HTMLheaderRole.replace('%data%', bio.role);
    var name = HTMLheaderName.replace('%data%', bio.name);
    var bioPic = HTMLbioPic.replace('%data%', bio.biopic);
    var welcomeMsg = HTMLwelcomeMsg.replace('%data%', bio.welcomeMessage);
    var mobile = HTMLmobile.replace("%data%", bio.contacts.mobile);
    var email = HTMLemail.replace("%data%", bio.contacts.email);
    var github = HTMLgithub.replace(/%data%/g, bio.contacts.github);
    var twitter = HTMLtwitter.replace("%data%", bio.contacts.twitter);
    var location = HTMLlocation.replace("%data%", bio.contacts.location);
    var connect = mobile + email + github + twitter + location;
    
    $("#header").prepend(role);
    $("#header").prepend(name);
    $("#header").append(bioPic);
    $("#header").append(welcomeMsg);
    $("#topContacts").append(connect);
    $("#footerContacts").append(connect);
    
    
    if (bio.skills.length >= 1){
    	$("#header").append(HTMLskillsStart);
    	for (var i=0; i < bio.skills.length; i++){
  			var skillsData = HTMLskills.replace('%data%', bio.skills[i]);
  			$("#skills").append(skillsData);
    	}
    };
  }
};

var education = {
  schools: [
    {
      name: "Collins College",
      location: "Phoenix AZ",
      degree: "BA",
      majors: ["Game Development"],
      dates: 2015,
      url: "http://www.collinscollege.edu/"
    }
  ],
  onlineCourses: [
    {
      title: "Front-End Web Developer Nanodegree",
      school: "Udacity",
      date: 2015,
      url: "https://www.udacity.com"
    }
  ],
  display: function(){
    
    var i, item, items, html, element;
    var container = $("#education");
    
    //-- Add Schools
    items = education.schools;
    html = "";
    for(i=0; i<items.length; i++){
      item = items[i];
      var element = $(HTMLschoolStart).appendTo(container);
      html = HTMLschoolName.replace('%data%', item.name) + HTMLschoolDegree.replace('%data%', item.degree);
      html = html.replace("#", item.url);
      html += HTMLschoolDates.replace('%data%', item.dates) + HTMLschoolLocation.replace('%data%', item.location) + HTMLschoolMajor.replace('%data%', item.majors);
      
      $(element).html(html);
    }
    
    //-- Add Courses
    container.append(HTMLonlineClasses);
    items = education.onlineCourses;
    html = "";
    for(i=0; i<items.length; i++){
      item = items[i];
      element = $(HTMLschoolStart).appendTo(container);
      html = HTMLonlineTitle.replace('%data%', item.title) + HTMLonlineSchool.replace('%data%', item.school);
      html = html.replace("#", item.url);
      html += HTMLonlineDates.replace('%data%', item.date);
      
      $(element).html(html);
    }
    
  }
};

var work = {
  jobs: [
    {
      employer: "Sokikom",
      title: "Senior Software Engineer",
      location: "Mountain View, CA",
      dates: "2011 - Present",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      url: "https://www.google.com"
    },
    {
      employer: "Virtual Learning Technologies",
      title: "Game Developer",
      location: "Phoenix, AZ",
      dates: "2006 - 2011",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      url: "https://www.google.com"
    }
  ],
  display: function(){
    var i, item, items, html, element;
    var container = $("#workExperience");
    
    //-- Add Jobs
    items = work.jobs;
    html = "";
    for(i=0; i<items.length; i++){
      item = items[i];
      element = $(HTMLworkStart).appendTo(container);
      html = HTMLworkEmployer.replace('%data%', item.employer) + HTMLworkTitle.replace('%data%', item.title);
      html = html.replace("#", item.url);
      html += HTMLworkDates.replace('%data%', item.dates) + HTMLworkLocation.replace('%data%', item.location) + HTMLworkDescription.replace('%data%', item.description);
      
      $(element).html(html);
    }

  }
}

var projects = {
  projects: [
    {
      title: "Sample Project 2",
      dates: "2015",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      images: ["https://placehold.it/300x169","https://placehold.it/300x169"],
      url: "https://www.github.com"
    },
    {
      title: "Sample Project 1",
      dates: "2014",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      images: ["https://placehold.it/300x169","https://placehold.it/300x169"],
      url: "https://www.github.com"
    }
  ],
  display: function(){
    
    var i, item, items, html, element, k, images;
    var container = $("#projects");
    
    
    //-- Add projects
    items = projects.projects;
    html = "";
    for(i=0; i<items.length; i++){
      item = items[i];
      element = $(HTMLprojectStart).appendTo(container);
      html = HTMLprojectTitle.replace('%data%', item.title);
      html = html.replace("#", item.url);
      html += HTMLprojectDates.replace('%data%', item.dates) + HTMLprojectDescription.replace('%data%', item.description);
      
      images = item.images;
      for(k=0; k<images.length; k++){
        html += HTMLprojectImage.replace('%data%', images[k]);
      }
      
      $(element).html(html);
    }
  }
};


// Render some things
bio.display();
education.display();
work.display();
projects.display();

// GoGo Gadget Maps
$("#mapDiv").append(googleMap);