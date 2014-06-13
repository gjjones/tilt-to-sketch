module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      default: {
        options: {
          base: './app',
          hostname: 'localhost',
          livereload: true,
          open: { appName: 'chrome' }
        }
      }
    },
    watch: {
      default: {
        files: 'app/**/*.*',
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['connect', 'watch']);
};
