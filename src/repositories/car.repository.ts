import Car from "../models/car.model";
import carRoutes from "../routes/car.routes";

interface ICarRepository {
  save(car: Car): Car;
  retrieveAll(): Car[];
  retrieveById(carId: number): Car | null;
  update(car: Car): Car;
  delete(carId: number): boolean;
}

class CarRepository implements ICarRepository {

    cars: Car[] = [{id:1, model:'307', brand: 'Peugeot', year:2020}]

    
    save(car: Car): Car {
        car.id = this.cars.length+1
        this.cars.push(car)
        return car
    }

    retrieveAll(): Car[] {
        return this.cars;
    }

    retrieveById(carId: number): Car | null {
        return this.cars.find((car) => car.id === carId) ?? null 
    }

    update(carPayload: Car): Car {
        const carIndex = this.cars.findIndex((car) => car.id === carPayload.id);

        if(carIndex === -1) {
            // if the car does not exists, we create it. Other option is to send a 404.
            this.cars.push(carPayload)
        } else {
            this.cars[carIndex] = carPayload 
        }
        
        return carPayload;
    }

    delete(carId: number): boolean {
        const carIndex = this.cars.findIndex((car) => car.id === carId);
      
        if(carIndex != -1) {
            this.cars.splice(carIndex, 1)
        }
        
        return true;
    }
   
}



export default new CarRepository();
