// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract iot{
    uint public milkBottles;
    uint public eggCrates;

    function getOneMilk() public {
        milkBottles += 1;

    }

    function getOneEgg() public {
         eggCrates += 1;

    }
}
