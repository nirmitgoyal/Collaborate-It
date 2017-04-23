function OnRun($rootScope, AppSettings) {
    'ngInject';

    // change page title based on state
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        console.log('stateChangeSuccess');

        $rootScope.pageTitle = 'Collaborate-It | Real Time Code Collaborator';

        if (toState.title) {
            $rootScope.pageTitle += toState.title;
            $rootScope.pageTitle += ' \u2014 ';
        }

        $rootScope.pageTitle += AppSettings.appTitle;
    });

}

export default OnRun;
