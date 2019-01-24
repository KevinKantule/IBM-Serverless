/**
 * Web application
 */
const apiUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/7e23c3cadb93f650a0911a0a0394ab35c9a4f77fab0f8283fe4d20489198d454/guestbook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        email,
        comment,
      }),
      dataType: 'json',
    });
  }
};

const sgMail = (SENDGRID_API_KEY='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'); //require('@sendgrid/mail');
//sgMail.setApiKey = (SENDGRID_API_KEY='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'); //(process.env.SENDGRID_API_KEY);  //SENDGRID_API_KEY='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'"
const msg = {
  to: "#email",
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg);

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();
