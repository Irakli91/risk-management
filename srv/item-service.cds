
using {riskmanagement as rm} from '../db/schema';

@path: 'service/item'
service ItemService {
    @restrict: [
        {
            grant: 'READ',
            where: 'createdBy = $user'
        }
    ]
    entity Items as projection on rm.Items;

    function filterItemsByQuantity(quantity: Integer) returns array of Items;

    action createNewItem(title: String, quantity: Integer) returns Items;
}