
using {riskmanagement as rm} from '../db/schema';

@path: 'service/item'
service ItemService {
    entity Items as projection on rm.Items;

    function filterItemsByQuantity(quantity: Integer) returns array of Items;

    action createNewItem(title: String, quantity: Integer) returns Items;
}