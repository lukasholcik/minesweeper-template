///<reference path="ref.d.ts"/>

import * as api from "./common/api";
import MinefieldService from "./services/minefield.service";

function getCompiledElement($compile:ng.ICompileService, directive:string, $scope:ng.IScope):ng.IAugmentedJQuery {
    const el = angular.element(directive);
    const compiledElement = $compile(el)($scope);

    $scope.$apply();
    return compiledElement;
}

describe("SolarWinds MineSweeper >", ()=> {

    let $scope:any,
        $controller:ng.IControllerService,
        $compile:ng.ICompileService,
        minefieldService:MinefieldService;
    beforeEach(angular.mock.module("minesweeper"));

    beforeEach(inject(($injector:any)=> {
        $controller = $injector.get("$controller");
        $scope = $injector.get("$rootScope").$new();
        $compile = $injector.get("$compile");
        minefieldService = $injector.get("swMinefieldService");

        const $templateCache:ng.ITemplateCacheService = $injector.get("$templateCache");
    }));

    // Minefield that looks like: 01X1
    const smallMinefield = new api.MinefieldData(4, 1, 1, [
        [
            {
                x: 0,
                y: 0,
                hasMine: false,
                status: api.MinefieldCellStatus.HIDDEN,
                neighbours: 0
            },
            {
                x: 1,
                y: 0,
                hasMine: false,
                status: api.MinefieldCellStatus.HIDDEN,
                neighbours: 1
            },
            {
                x: 2,
                y: 0,
                hasMine: true,
                status: api.MinefieldCellStatus.HIDDEN,
                neighbours: 0
            },
            {
                x: 3,
                y: 0,
                hasMine: false,
                status: api.MinefieldCellStatus.HIDDEN,
                neighbours: 1
            },
        ]
    ]);

    it("minefield.directive.html > shows minefield matrix for given data", ()=> {
        const height = 10;
        const width = 10;
        const randomMinefield = minefieldService.newMinefield(width, height, 10);

        $scope.minefield = randomMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell").length).toBe(height * width);
    });

    it("cell.controller.ts > adds .sw-cell__button--hidden class when the sw-cell button status is" +
        " MinefieldCellStatus.HIDDEN", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell__button:first").hasClass("sw-cell_button--hidden")).toBe(true);
    });

    it("minefield.controller.ts > executes the on-click callback with proper cellData when the .sw-cell__button is" +
        " clicked", ()=> {
        $scope.cellData = smallMinefield[0][0];
        $scope.onClick = (cellData:api.IMinefieldCell)=> {
        };

        const eventSpy = spyOn($scope, "onClick");

        const html = `<sw-cell cell-data="onClick(cellData)" on-click="onClick"></sw-cell>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();

        expect(eventSpy).toHaveBeenCalledWith($scope.cellData);
    });

    it("minefield.controller.ts > sets the cell status to MinefieldCellStatus.REVEALED after clicking on" +
        " HIDDEN cell", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();
        expect(element.find(".sw-cell__button:").hasClass("sw-cell__button--revealed")).toBe(true);
    });

    it("minefield.controller.ts > uses swMinefieldService.reveal() to reveal the cell", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();
        expect($(element.find(".sw-cell__button")[1]).hasClass("sw-cell__button--revealed")).toBe(true);
    });

    it("minefield.directive.html > shows number of neighbours on the cell button when neighbours > 1", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var firstCell = $(element.find(".sw-cell__button")[0]);
        var secondCell = $(element.find(".sw-cell__button")[1]);
        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.text().trim()).not.toBe("0");
        expect(secondCell.text().trim()).toBe("1");
    });

    it("minefield.directive.html > shows &nbsp; on a cell button when there are no neighbours", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var firstCell = $(element.find(".sw-cell__button")[0]);
        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.text().trim()).toBe("&nbsp;");
    });

    /*
     * BUTTON CLASSES
     */

    it("cell.directive.html > adds proper .sw-cell__button--neighbour-* class to cell button", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var firstCell = $(element.find(".sw-cell__button")[0]);
        var secondCell = $(element.find(".sw-cell__button")[1]);
        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(secondCell.hasClass(".sw-cell__button--neighbours-1")).toBe(true);
    });

    it("cell.directive.html > should add .sw-cell__button--has-mine class to revealed cell button with a mine", ()=>{
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var mineCell = $(element.find(".sw-cell__button")[2]);
        expect(mineCell.hasClass(".sw-cell__button--has-mine")).toBe(false);
        mineCell.triggerHandler("click");
        $scope.$apply();
        expect(mineCell.hasClass(".sw-cell__button--has-mine")).toBe(true);
    });

    /*
     * GAME STATUS
     */

    it("minefield.controller.ts > should disable whole minefield (all minefield cell buttons) after revealing a " +
        "cell with a mine - i.e. player loses the game", ()=>{
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var mineCell = $(element.find(".sw-cell__button")[3]);
        mineCell.triggerHandler("click");
        $scope.$apply();
        for (let i = 0; i < 3; i++) {
            var cell = $(element.find(".sw-cell__button")[i]);
            expect(cell.is("[disabled]")).toBe(true);
        }
    });

    it("minefield.controller.ts > should disable whole minefield (all minefield cell buttons) after revealing " +
        "all cells without mines - i.e. player wins the game", ()=>{
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        $(element.find(".sw-cell__button")[1]).triggerHandler("click");
        $scope.$apply();
        $(element.find(".sw-cell__button")[0]).triggerHandler("click");
        $scope.$apply();

        for (let i = 0; i < 3; i++) {
            var cell = $(element.find(".sw-cell__button")[i]);
            expect(cell.is("[disabled]")).toBe(true);
        }
    });

    /*
     * FLAGGED CELLS
     */

    it("minefield.controller.ts > shift+click on hidden cell should set the state to FLAGGED", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const firstCell = element.find(".sw-cell__button:first");
        const event:JQueryEventObject = <JQueryEventObject>{};
        event.which = 1;
        event.target = firstCell[0];
        event.shiftKey = true;
        firstCell.triggerHandler(event);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(true);
    });

    it("minefield.controller.ts > shift+click on revealed cell shouldn't flag it", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const firstCell = element.find(".sw-cell__button:first");
        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--revealed")).toBe(true);

        const event:JQueryEventObject = <JQueryEventObject>{};
        event.button = 1;
        event.target = firstCell[0];
        event.shiftKey = true;
        firstCell.triggerHandler(event);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).not.toBe(true);
    });

    it("minefield.controller.ts > click on flagged cell should set the state to HIDDEN", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        const firstCell = element.find(".sw-cell__button:first");
        const event:JQueryEventObject = <JQueryEventObject>{};
        event.which = 1;
        event.target = firstCell[0];
        event.shiftKey = true;
        firstCell.triggerHandler(event);
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--revealed")).toBe(false);
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(true);

        firstCell.triggerHandler("click");
        $scope.$apply();
        expect(firstCell.hasClass("sw-cell__button--flagged")).toBe(false);
        expect(firstCell.hasClass("sw-cell__button--revealed")).toBe(true);
    });

});
