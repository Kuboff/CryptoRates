import { Component, OnInit, Inject } from '@angular/core';
import { Pair } from 'src/app/core/models/pair';
import { PairsService } from '../core/services/pairs.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.css']
})
export class PairsComponent implements OnInit {

  public pairs: Pair[];

  constructor(private pairsService: PairsService) {
    this.updatePairs();


    //Prices update in the db every minute, thats why we send a query once a minute
    let updatePairsSubsription = interval(60000).subscribe(() => {
      this.updatePairs();
    });
  }

  ngOnInit() { }

  newPairAdded(pair: Pair) {
    this.pairs.push(pair);
  }

  deletePair(id: number) {
    this.pairsService.deletePair(id).subscribe(r => {
      this.pairs.splice(this.pairs.findIndex(p => p.pairId === id), 1);
    }, error => console.error(error));
  }

  updatePairs() {
    this.pairsService.getAllPairs().subscribe(result => {
      this.pairs = result;
    }, error => console.error(error));
  }

  checkPrices() {
    this.pairs.forEach((pair) => {
      if (pair.isNotifyOnPrice) {
        if (pair.previousPriceFirstToSecond > pair.targetPrice && pair.targetPrice > pair.priceFirstToSecond) {
          //Downwards
          console.log(pair.firstCurrencySymbol + '/' + pair.secondCurrencySymbol + ' crossed ' + pair.targetPrice + ' downwards');
        }
        else if (pair.previousPriceFirstToSecond < pair.targetPrice && pair.targetPrice < pair.priceFirstToSecond) {
          //Upwards
          console.log(pair.firstCurrencySymbol + '/' + pair.secondCurrencySymbol + ' crossed ' + pair.targetPrice + ' upwards');
        }
      }
    });
  }
}

