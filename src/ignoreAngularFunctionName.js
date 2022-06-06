// https://angular.io/guide/lifecycle-hooks#lifecycle-event-sequence
const angularExcludes = [
    "ngOnChanges",
    "ngOnInit",
    "ngDoCheck",
    "ngAfterContentInit",
    "ngAfterContentChecked",
    "ngAfterViewInit",
    "ngAfterViewChecked",
    "ngOnDestroy",
];

/**
 * Should the function be excluded, as it's one of the common
 * angular named functions?
 * @param  {String} functionName    The name of the function
 * @return {Boolean}                True if the rules should be ignored for this function
 */
function ignoreAngularFunctionName(functionName) {
    return angularExcludes.includes(functionName);
}

module.exports = {
    ignoreAngularFunctionName,
};
