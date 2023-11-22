import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public createUserForm!: FormGroup;
  public headerText!: string;
  public buttonText!: string;
  public addUser: boolean = false;
  public editUser: boolean = false;
  private dataToUpdate!: DocumentData;
  public crudOperation: boolean = false;
  private formSubmitAttempt!: boolean;
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'edit',
    'delete',
  ];
  public dataSource!: any;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private toastrService: ToastrService
  ) {
    this.getUsers();
  }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      phoneNumber: ['', Validators.required],
    });
  }

  showUsers(event: any): void {
    event.preventDefault();
    this.addUser = false;
    this.editUser = false;
    this.crudOperation = false;
  }

  isFieldInvalid(field: string): boolean {
    return (
      (!this.createUserForm.get(field)!.valid &&
        this.createUserForm.get(field)!.touched) ||
      (this.createUserForm.get(field)!.untouched && this.formSubmitAttempt)
    );
  }

  additionOfUser(): void {
    this.addUser = true;
    this.crudOperation = true;
    this.buttonText = 'Add';
    this.headerText = 'Create';
  }

  onSubmitUser(form: FormGroup): void {
    if (this.buttonText === 'Add') {
      this.onAddUser(form);
    } else {
      this.onEditUser(form.value);
    }
  }

  onAddUser(form: FormGroup): void {
    this.formSubmitAttempt = true;
    if (form.valid === true) {
      this.dataService
        .addUser(form.value)
        .then(() => {
          this.toastrService.success('User added successfully');
        })
        .catch((err) => {
          this.toastrService.error('Something went wrong');
        });
      this.addUser = false;
      this.editUser = false;
      this.crudOperation = false;
      this.getUsers();
      this.createUserForm.reset();
    }
  }

  getUsers(): void {
    this.crudOperation = false;
    this.dataService.getUsers().subscribe((data) => {
      this.dataSource = data;
    });
  }

  updationOfUser(data: DocumentData): void {
    this.dataToUpdate = data;
    this.formSubmitAttempt = true;
    this.editUser = true;
    this.addUser = false;
    this.crudOperation = true;
    this.buttonText = 'Edit';
    this.headerText = 'Edit';
    this.createUserForm.setValue({
      firstName: data['firstName'],
      lastName: data['lastName'],
      email: data['email'],
      phoneNumber: data['phoneNumber'],
    });
  }

  onEditUser(data: any): void {
    if (this.createUserForm.valid === true) {
      this.dataService
        .updateUser(this.dataToUpdate['id'], data)
        .then(() => {
          this.toastrService.success('User updated successfully');
        })
        .catch((err) => {
          this.toastrService.error('Something went wrong');
        });
      this.addUser = false;
      this.editUser = false;
      this.crudOperation = false;
      this.createUserForm.reset();
      this.getUsers();
    }
  }

  deleteUser(id: string): void {
    this.dataService
      .deleteUser(id)
      .then(() => {
        this.toastrService.success('User deleted successfully');
      })
      .catch((err) => {
        this.toastrService.error('Invalid Email or Password');
      });
  }
}
