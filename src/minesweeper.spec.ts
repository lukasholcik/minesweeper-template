///<reference path="ref.d.ts"/>

import * as api from "./common/api";
import MinefieldService from "./services/minefield.service";
import MinefieldController from "./components/minefield/minefield.controller";
import {MinefieldCellStatus} from "./common/api";

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

    // Minefield that looks like: 01X2X
    const smallMinefield = new api.MinefieldData(5, 1, 1, [
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
                neighbours: 2
            },
            {
                x: 4,
                y: 0,
                hasMine: true,
                status: api.MinefieldCellStatus.HIDDEN,
                neighbours: 0
            }
        ]
    ]);

    /**
     * In `minefield.directive.html` you can see the first cell already rendered. Your task is to display all cells
     * in the minefield. The two dimensional array is available as vm.minefield.matrix. Display the matrix as a
     * table.
     */
    it("shows minefield matrix for given data", ()=> {
        const height = 10;
        const width = 10;
        const randomMinefield = minefieldService.newMinefield(width, height, 10);

        $scope.minefield = randomMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell").length).toBe(height * width);
    });

    /**
     * In the cell.controller.ts controller class you see a getButtonClasses() method that returns an object that
     * being passed to ng-class on the button. Your task here is to implement the sw-cell__button--hidden condition.
     * To access the cell state value use this.cellData.status. Find the possible value in the MinefieldCellStatus
     * class in common/api.ts
     */
    it("adds .sw-cell__button--hidden class when the sw-cell button status is" +
        " MinefieldCellStatus.HIDDEN", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        expect(element.find(".sw-cell__button:first").hasClass("sw-cell_button--hidden")).toBe(true);
    });

    /**
     * When user clicks the button in cell.directive.html, it should trigger the on-click callback that's being
     * passed from minefield.directive.html. Don't forget to pass the `cellData` argument properly (hint:
     * vm.onClick({cellData: ...}))
     */
    it("executes the on-click callback with proper cellData when the .sw-cell__button is" +
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

    /**
     * After clicking on the cell, reveal the cell so that it shows what's hidden. `swMinefieldService.reveal()` is
     * your friend and it will do the necessary magic for you, just call it with correct arguments. You can find the
     * service in `services/minefield.service.ts`. Don't forget to access it as `this.swMinefieldService` in
     * TypeScript class.
     */
    it("uses swMinefieldService.reveal() to reveal the cell", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        element.find(".sw-cell__button:first").triggerHandler("click");
        $scope.$apply();
        expect($(element.find(".sw-cell__button")[1]).hasClass("sw-cell__button--revealed")).toBe(true);
    });

    /**
     * In cell.directive.html, you're expected to display the number of mines on adjacent cells. Access this information
     * through `vm.cellData.neighbours`. Show the number only when it's > 0 and only when the cell is revealed (check
     * cellData.status).
     */
    it("shows number of neighbours on the cell button when neighbours > 1", ()=> {
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

    /**
     * The buttons don't have proper sizing when there is no text displayed. Show &nbsp; on the cell button without
     * text (i.e. without neighbour count information).
     */
    it("shows &nbsp; on a cell button when there are no neighbours", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var firstCell = $(element.find(".sw-cell__button")[0]);
        // before reveal
        expect(firstCell.text().trim()).toBe("&nbsp;");

        firstCell.triggerHandler("click");
        $scope.$apply();
        // after reveal
        expect(firstCell.text().trim()).toBe("&nbsp;");
    });

    /*
     * BUTTON CLASSES
     */

    /**
     * Let's look at button classes in cell.controller.ts again ... we need to add the .sw-cell__button--neighbour-X
     * class to the button where X = vm.cellData.neighbours to make it more colorful. The conditions are:
     * 1. only add the class when the cell is revealed so that the user can't figure out anything from the page source
     * 2. don't add the class when `neighbours === 0`
     */
    it("adds proper .sw-cell__button--neighbour-* class to cell button", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var firstCell = $(element.find(".sw-cell__button")[0]);
        var secondCell = $(element.find(".sw-cell__button")[1]);

        expect(firstCell.hasClass(".sw-cell__button--neighbours-0")).toBe(false);
        expect(secondCell.hasClass(".sw-cell__button--neighbours-1")).toBe(false);

        firstCell.triggerHandler("click");
        $scope.$apply();

        expect(firstCell.hasClass(".sw-cell__button--neighbours-0")).toBe(false);
        expect(secondCell.hasClass(".sw-cell__button--neighbours-1")).toBe(true);
    });

    /**
     * When the cell is revealed and there is a mine on the cell, there should be a .sw-cell__button--has-mine on
     * the button.
     */
    it("should add .sw-cell__button--has-mine class to revealed cell button with a mine", ()=> {
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

    /**
     * In minefield.controller.ts, there is a gameStatus property. Set and use this information to disable the whole
     * minefield once the user reveals a cell with mine present.
     */
    it("should disable whole minefield (all minefield cell buttons) after revealing a " +
        "cell with a mine - i.e. player loses the game", ()=> {
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

    /**
     * To satisfy this test you need to keep track of number of revealed cells. The swMinefieldService.reveal()
     * method returns number of revealed cells so you'll need to accumulate this number until it reaches total cells
     * - number of mines. Minefield info like dimensions and number of mines is accessible in
     * `minefield.controller.ts` through `vm.minefield` attributes `height`, `width`, `mines`.
     */
    it("should disable whole minefield (all minefield cell buttons) after revealing " +
        "all cells without mines - i.e. player wins the game", ()=> {
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

    /**
     * In Windows MineSweeper it's possible to flag a suspected cell, so that you can avoid it in the future. Original
     * game uses right-click for this, but in browsers it's tricky to handle anything other than left-click, so we'll
     * use shift+click for this feature. Change the cell status to MinefieldCellStatus.FLAGGED when the user clicks a
     * hidden cell with shift key pressed.
     */
    it("shift+click on hidden cell should set the state to FLAGGED", ()=> {
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

    /**
     * Flagging shouldn't work for revealed cells.
     */
    it("shift+click on revealed cell shouldn't flag it", ()=> {
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

    /**
     * Clicking on a flagged cell should set the state back to HIDDEN.
     */
    it("click on flagged cell should set the state to HIDDEN", ()=> {
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

    /**
     * When player clicks a cell with a mine, all the mines on the minefield should be revealed.
     */
    it("should reveal all mines when game was lost", ()=> {
        $scope.minefield = smallMinefield;

        const html = `<sw-minefield minefield="minefield"></sw-minefield>`;
        const element = getCompiledElement($compile, html, $scope);

        var mineCell = $(element.find(".sw-cell__button")[3]);
        mineCell.triggerHandler("click");
        $scope.$apply();

        const mineCell1 = $(element.find(".sw-cell__button")[3]);
        const mineCell2 = $(element.find(".sw-cell__button")[5]);

        expect(mineCell1.hasClass("sw-cell__button--revealed")).toBe(true);
        expect(mineCell2.hasClass("sw-cell__button--revealed")).toBe(true);
    });

    /*
     * RESTART BUTTON
     */

    /**
     * In `game.directive.html` there is a button that should restart the game when you click on it. You can find the logic
     * that initializes the minefield in `game.controller.ts`
     */
    it("restarts the game by clicking on the `sw-game__restart-button`", ()=> {
        const html = `<sw-game></sw-game>`;
        const element = getCompiledElement($compile, html, $scope);

        const minefieldCtrl = <MinefieldController> element.find(".sw-minefield").controller("swMinefield");
        minefieldCtrl.minefield = smallMinefield;
        $scope.$apply();

        // click on a mine to make sure the game is lost
        const mineCell = $(element.find(".sw-cell__button")[3]);
        mineCell.triggerHandler("click");
        $scope.$apply();
        expect(minefieldCtrl.minefield[0][3].status).toBe(MinefieldCellStatus.REVEALED);

        const restartButton = element.find(".sw-game__restart-button");
        restartButton.triggerHandler("click");

        // make sure all cells are hidden again
        for (let i = 0; i < minefieldCtrl.minefield[0].length; i++) {
            expect(minefieldCtrl.minefield[0][i].status).toBe(MinefieldCellStatus.HIDDEN);
        }
    });

    /**
     * While the game is in progress (GameController.gameStatus === EGameStatus.IN_PROGRESS), there should be a
     * .sw-game__restart-button--in-progress class on the restart button.
     */
    it("adds sw-game__restart-button--in-progress class to button while the game is in progress", ()=> {

    });

    /**
     * Add .sw-game__restart-button--fail class on the restart button when the player lost the game.
     */
    it("adds sw-game__restart-button--fail class to restart button when the player lost the game", ()=> {

    });

    /**
     * Add .sw-game__restart-button--fail class on the restart button when the player lost the game.
     */
    it("adds sw-game__restart-button--success class to restart button when the player won the game", ()=> {

    });

    /**
     * In original MineSweeper game there is a counter that shows [total_number_of_mines - flagged_cells].
     */
    it("shows the number of remaining mines in .sw-game__countdown element", ()=> {

    });

});
